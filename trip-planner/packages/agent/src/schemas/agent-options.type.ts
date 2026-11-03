import { BaseCheckpointSaver } from "@langchain/langgraph";
import z from "zod";

export interface AgentOptions {
    tavilyApiKey: string;
    GEOAPIFY_API_KEY: string;
    model?: string;
    thinking?: boolean;
    ollamaBaseUrl?: string;
    checkpointer?: BaseCheckpointSaver;
    responseFormat: z.ZodObject;
    systemPrompt: string;
}
