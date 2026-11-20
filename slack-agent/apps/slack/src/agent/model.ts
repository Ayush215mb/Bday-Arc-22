import { createDeepseekModel } from "@slack-agent/agent";
import { models } from "@slack-agent/agent";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL;

if (!DEEPSEEK_API_KEY || !DEEPSEEK_BASE_URL)
    throw new Error("Deepseeks config missing");

export const deepseekModel = createDeepseekModel({
    apiKey: DEEPSEEK_API_KEY,
    baseURL: DEEPSEEK_BASE_URL,
    modelId: models.deepseek,
});
