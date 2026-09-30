import { ChatGoogle } from "@langchain/google";
import { tool } from "@langchain/core/tools";
import {
    StateGraph,
    StateSchema,
    MessagesValue,
    ReducedValue,
    GraphNode,
    ConditionalEdgeRouter,
    START,
    END,
} from "@langchain/langgraph";
import { z } from "zod/v4";
import {
    SystemMessage,
    AIMessage,
    ToolMessage,
} from "@langchain/core/messages";
import "dotenv/config";

const model = new ChatGoogle("gemini-3.5-flash", {
    apiKey: process.env.GEMINI_API_KEY!,
});

// Define tools
const add = tool(({ a, b }) => a + b, {
    name: "add",
    description: "Add two numbers",
    schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
});

const multiply = tool(({ a, b }) => a * b, {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
});

const divide = tool(({ a, b }) => a / b, {
    name: "divide",
    description: "Divide two numbers",
    schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
});

// Augment the LLM with tools
const toolsByName = {
    [add.name]: add,
    [multiply.name]: multiply,
    [divide.name]: divide,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

// Define state
const MessagesState = new StateSchema({
    messages: MessagesValue,
    llmCalls: new ReducedValue(z.number().default(0), {
        reducer: (x, y) => x + y,
    }),
});

//Define model node
const llmCall: GraphNode<typeof MessagesState> = async (state) => {
    const response = await modelWithTools.invoke([
        new SystemMessage(
            "You are a helpful assistant tasked with performing arithmetic on a set of inputs.",
        ),
        ...state.messages,
    ]);
    return {
        messages: [response],
        llmCalls: 1,
    };
};

//Define tool node
const toolNode: GraphNode<typeof MessagesState> = async (state) => {
    const lastMessage = state.messages.at(-1);

    if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
        return { messages: [] };
    }

    const result: ToolMessage[] = [];
    for (const toolCall of lastMessage.tool_calls ?? []) {
        const tool = toolsByName[toolCall.name];
        const observation = await tool.invoke(toolCall);
        result.push(observation);
    }

    return { messages: result };
};

//Define end logic
const shouldContinue: ConditionalEdgeRouter<{
    InputSchema: typeof MessagesState;
    Nodes: "toolNode";
}> = (state) => {
    const lastMessage = state.messages.at(-1);

    // Check if it's an AIMessage before accessing tool_calls
    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return END;
    }

    // If the LLM makes a tool call, then perform an action
    if (lastMessage.tool_calls?.length) {
        return "toolNode";
    }

    // Otherwise, we stop (reply to the user)
    return END;
};

// Build and compile the agent
const workflow = new StateGraph(MessagesState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "llmCall");

export const graph = workflow.compile();
