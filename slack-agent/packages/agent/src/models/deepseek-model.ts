import { createOpenAI } from "@ai-sdk/openai";
import { models } from "../types/models.type";

export type DeepseekConfig = {
    apiKey: string;
    baseURL: string;
    modelId?: string;
};

export const createDeepseekModel = ({
    apiKey,
    baseURL,
    modelId = models.deepseek,
}: DeepseekConfig) =>
    createOpenAI({ name: "deepseek", baseURL, apiKey }).chat(modelId);
