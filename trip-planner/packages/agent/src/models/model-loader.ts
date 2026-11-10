import { ChatOllama } from "@langchain/ollama";
import { existingModels } from "../schemas";
import { ChatOpenAI } from "@langchain/openai";

export function loadModel(opts: {
    model?: string;
    baseUrl?: string;
    thinking?: boolean;
}) {
    return new ChatOllama({
        model: opts.model ?? existingModels.gemma,
        baseUrl: opts.baseUrl ?? "http://localhost:11434",
        think: opts.thinking ?? true,
        numCtx: 10000,
    });
}

export function loadDeepseek(opts: {
    model: string;
    baseUrl?: string;
    apikey: string;
    streaming?: boolean;
}) {
    return new ChatOpenAI(opts.model!, {
        streaming: opts.streaming,
        reasoning: { context: "auto", effort: "none" },
        configuration: {
            baseURL: opts.baseUrl ?? process.env.DEEPSEEK_BASE_URL,
            apiKey: opts.apikey,
        },
    });
}
