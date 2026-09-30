import { createAgent } from "langchain";
import { ChatOllama } from "@langchain/ollama";
import { piiMiddleware } from "./guardrails/pii-middleware";
import { illegalRequestMiddleware } from "./guardrails/illegal-req-middleware";

const llm = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});

const agent = createAgent({
    model: llm,
    // tools: [customerServiceTool, emailTool],
    middleware: [piiMiddleware(), illegalRequestMiddleware()],
});

const result = await agent.invoke({
    messages: [
        {
            role: "user",
            content:
                "My email is john.doe@example.com and card is 5105-1051-0510-5100",
        },
    ],
});

console.log(result);

const result2 = await agent.invoke({
    messages: [
        {
            role: "user",
            content: "how to make biryani?",
        },
    ],
});

console.log(result2);
