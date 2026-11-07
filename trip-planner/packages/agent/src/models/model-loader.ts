import { ChatOllama } from "@langchain/ollama";
import { existingModels } from "../schemas";
import { ChatDeepSeek } from "@langchain/deepseek";

export function loadModel(opts: {
    model?: string;
    baseUrl?: string;
    thinking?: boolean;
}) {
    return new ChatOllama({
        model: opts.model ?? existingModels.gemma,
        baseUrl: opts.baseUrl ?? "http://localhost:11434",
        headers: {
            Authorization: `Bearer sk-gm-free-qKs1jCNqpDRB9GZuk3E2xz7PClD4A8WJqhhhWONR`,
            "Content-Type": "application/json",
        },
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
    return new ChatDeepSeek(opts.model!, {
        streaming: opts.streaming,
        configuration: {
            baseURL: opts.baseUrl,
            apiKey: opts.apikey,
        },
    });

    //""
}
