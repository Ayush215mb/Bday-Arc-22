import { BaseCheckpointSaver } from "@langchain/langgraph";
import z from "zod";

import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface AgentOptions {
    tavilyApiKey?: string;
    GEOAPIFY_API_KEY?: string;
    model: string | BaseChatModel;
    apikey?: string;
    thinking?: boolean;
    BaseUrl?: string;
    checkpointer?: BaseCheckpointSaver;
    responseFormat: z.ZodObject;
    systemPrompt?: string;
}
