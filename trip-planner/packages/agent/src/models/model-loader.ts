import { ChatOllama } from "@langchain/ollama";

export function loadModel(opts: { model?: string; baseUrl?: string }) {
    return new ChatOllama({
        model: opts.model ?? "qwen3.5:9b",
        baseUrl: opts.baseUrl ?? "http://localhost:11434",
        numCtx: 30000,
        temperature: 0.2,
        think: false,
    });
}
