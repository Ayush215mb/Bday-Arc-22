import {
    Annotation,
    END,
    GraphDrained,
    MemorySaver,
    MessagesAnnotation,
    START,
    StateGraph,
} from "@langchain/langgraph";
import { ChatGoogle } from "@langchain/google";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";
import { AIMessage } from "@langchain/core/messages";
import { logEvent } from "./utils";

const graphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    refundAuthorized: Annotation<boolean>(),
});

const llm = new ChatGoogle("gemini-3.5-flash", {
    apiKey: process.env.GEMINI_API_KEY!,
});

const processRefundTool = tool(
    (input) => {
        return `Successfully processed refund for ${input.orderid}`;
    },
    {
        name: "process_refund",
        description: "Process a refund for a given order ID",
        schema: z.object({
            orderid: z.string().describe("The ID of order to refunded"),
        }),
    },
);

const tools = [processRefundTool];

const callTool = async (state: typeof graphAnnotation.State) => {
    const { messages, refundAuthorized } = state;

    if (!refundAuthorized) {
        throw new Error("Permission to refund is required");
    }

    const lastMessage = messages[messages.length - 1];

    const messageCastAI = lastMessage as AIMessage;
    console.log("\ninside callTool: ", messageCastAI, "\n\n\n");

    if (messageCastAI.type != "ai" || !messageCastAI.tool_calls?.length) {
        throw new Error("No tools were called");
    }

    const toolCall = messageCastAI.tool_calls[0];

    const refundResult = await processRefundTool.invoke(toolCall);

    return {
        messages: refundResult,
    };
};

const callModel = async (state: typeof graphAnnotation.State) => {
    const { messages } = state;

    const llmWithTools = llm.bindTools(tools);
    const result = await llmWithTools.invoke(messages);
    return { messages: [result] };
};

const shouldContinue = async (state: typeof graphAnnotation.State) => {
    const { messages } = state;

    const lastMessage = messages[messages.length - 1];
    const messageCastAI = lastMessage as AIMessage;
    console.log("\ninside shouldContinue: ", messageCastAI, "\n\n\n");
    if (messageCastAI.type != "ai" || !messageCastAI.tool_calls?.length) {
        //llm did not call any tools, or it's not an AI message so we should end
        return END;
    }

    return "tools";
};

const workflow = new StateGraph(graphAnnotation)
    .addNode("agent", callModel)
    .addEdge(START, "agent")
    .addNode("tools", callTool)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue, ["tools", END]);

// graph.addConditionalEdges(START, routingFunction, [
//   true: "nodeB",
//   false: "nodeC",
// ]); -------------> shouldContinue return true then "tools" is returned and if false then END is returned

export const graph = workflow.compile({
    checkpointer: new MemorySaver(),
    interruptBefore: ["tools"],
});

async function main() {
    const config = {
        configurable: { thread_id: "refunder" },
        streamMode: "updates" as const,
    };
    const input = {
        messages: [
            {
                role: "user",
                content: "Can I have a refund for my purchase? Order no. 123",
            },
        ],
    };

    for await (const event of await graph.stream(input, config)) {
        const key = Object.keys(event)[0];
        if (key) {
            console.log(`Event: ${key}\n`);
        }
    }

    console.log("\n---INTERRUPTING GRAPH TO UPDATE STATE---\n\n");

    console.log(
        "---refundAuthorized value before state update---",
        (await graph.getState(config)).values.refundAuthorized,
    );

    await graph.updateState(config, { refundAuthorized: true });

    console.log(
        "---refundAuthorized value after state update---",
        (await graph.getState(config)).values.refundAuthorized,
    );

    console.log("\n---CONTINUING GRAPH AFTER STATE UPDATE---\n\n");

    for await (const event of await graph.stream(null, config)) {
        // Log the event to the terminal
        logEvent(event);
    }
}

main();
