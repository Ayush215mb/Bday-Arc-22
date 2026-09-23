import { createAgent, summarizationMiddleware, HumanMessage } from "langchain";
import { ChatOllama } from "@langchain/ollama";
import { MemorySaver } from "@langchain/langgraph";

const model = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});

const agent = createAgent({
    model: model,
    checkpointer: new MemorySaver(),
    middleware: [
        summarizationMiddleware({
            model: "ollama:qwen3.5:9b", // choose a model which is cheaper
            trigger: { messages: 8 }, //summarize after messages >10
            // trigger: { tokens: 4000 },//summarize after tokens >4000
            keep: { messages: 2 }, //keep 5 top messages
        }),
    ],
});

const config = { configurable: { thread_id: "user-1" } };

const questions = [
    "what is 2+2",
    "what is 3*3",
    "what is 10*5",
    "what is 92/4",
    "what is 912/6",
    "what is 99*34",
    "what is 12*81",
    "what is 91*91",
];

for (const q of questions) {
    const response = await agent.invoke(
        { messages: [new HumanMessage(q)] },
        config,
    );
    console.log(response.messages);
    console.log(response.messages.length);
}
