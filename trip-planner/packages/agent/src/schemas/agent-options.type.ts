import { BaseCheckpointSaver } from "@langchain/langgraph";
import z from "zod";

export interface AgentOptions {
    tavilyApiKey: string;
    GEOAPIFY_API_KEY: string;
    ollamaBaseUrl?: string;
    model?: string;
    checkpointer?: BaseCheckpointSaver;
    responseFormat: z.ZodObject;
    fastModel?: string;
}
