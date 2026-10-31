import { ChatOllama } from "@langchain/ollama";
import { existingModels } from "./existingModels";

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
