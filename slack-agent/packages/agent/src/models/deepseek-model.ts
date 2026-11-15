import { models } from "../types/models.type";
import { createOpenAI } from "@ai-sdk/openai";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL;

if (!DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not found");
if (!DEEPSEEK_BASE_URL) throw new Error("DEEPSEEK_BASE_URL not found");

const deepseek = createOpenAI({
    name: "deepseek",
    baseURL: DEEPSEEK_BASE_URL,
    apiKey: DEEPSEEK_API_KEY,
});

export const deepseekModel = deepseek(models.deepseek);
