import {
    createAgent,
    tool,
    summarizationMiddleware,
    HumanMessage,
    humanInTheLoopMiddleware,
} from "langchain";
import { ChatOllama } from "@langchain/ollama";
import { Command, MemorySaver } from "@langchain/langgraph";
import * as z from "zod";

const model = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 10000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});

const readEmailTool = tool(
    (input) => `Email content for ID: ${input.emailId}`,
    {
        name: "readEmailTool",
        description: "A tool to read emails",
        schema: z.object({
            emailId: z.email(),
        }),
    },
);

const sendEmailTool = tool(
    (input) => `Email sent to ${input.emailId} with subject '${input.subject}'`,
    {
        name: "sendEmailTool",
        description: "A tool to send emails",
        schema: z.object({
            emailId: z.email(),
            subject: z.string(),
            body: z.string(),
        }),
    },
);

const agent = createAgent({
    model: model,
    checkpointer: new MemorySaver(),
    tools: [readEmailTool, sendEmailTool],
    middleware: [
        humanInTheLoopMiddleware({
            interruptOn: {
                sendEmailTool: {
                    allowedDecisions: ["approve", "edit", "reject"],
                },
                readEmailTool: false,
            },
        }),
    ],
});

const config = { configurable: { thread_id: "user-1" } };

const res = await agent.invoke(
    {
        messages: [
            new HumanMessage(
                "Send an email to helo@gmail.com with subject 'hello' and body 'how r u?' using the tool 'sendEmailTool' ",
            ),
        ],
    },
    config,
);
console.log(res);

if ("__interrupt__" in res) {
    console.log("\nApproval Pending...");
    const result = await agent.invoke(
        new Command({
            resume: {
                decisions: [{ type: "approve" }],
            },
        }),
        config,
    );

    console.log(result);
}
