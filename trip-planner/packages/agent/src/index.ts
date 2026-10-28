import { createAgent } from "langchain";
import { MemorySaver, type BaseCheckpointSaver } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { loadModel } from "./models/model-loader";
import { SYSTEM_PROMPT } from "./prompts/prompt.ts";
import { currencyConversionTool } from "./tools/currency-converter.tool.ts";
import { calculatorTool } from "./tools/calculator.tool";
import "dotenv/config";
export interface AgentOptions {
    tavilyApiKey: string;
    ollamaBaseUrl?: string;
    model?: string;
    checkpointer?: BaseCheckpointSaver;
}

export function createTripPlannerAgent(opts: AgentOptions) {
    const search = new TavilySearch({
        tavilyApiKey: opts.tavilyApiKey,
        maxResults: 5,
    });

    return createAgent({
        model: loadModel({ model: opts.model, baseUrl: opts.ollamaBaseUrl }),
        tools: [search, currencyConversionTool, calculatorTool],
        systemPrompt: SYSTEM_PROMPT,
        checkpointer: opts.checkpointer ?? new MemorySaver(),
    });
}

export type TripAgent = ReturnType<typeof createTripPlannerAgent>;
