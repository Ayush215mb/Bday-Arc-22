import { ollama } from "ai-sdk-ollama";
import { models } from "../types/models.type";

export const qwenModel = ollama(models.qwen, {
    options: {
        num_ctx: 6000,
    },
});

export const gemmaModel = ollama(models.gemma, {
    options: {
        num_ctx: 6000,
    },
    think: false,
});
