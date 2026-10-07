import { ChatOllama } from "@langchain/ollama";

const qwen = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false,
    keepAlive: "15m",
});

const omnicoder = new ChatOllama({
    model: "omnicoder-2:9b",
    numCtx: 30000,
    temperature: 0.2,
    maxRetries: 10,
    think: false,
    keepAlive: "15m",
});

const gemma = new ChatOllama({
    model: "gemma4:12b",
    numCtx: 20000,
    temperature: 0.5,
    maxRetries: 5,
    think: false,
    keepAlive: "15m",
});

export default { qwen, omnicoder, gemma };
