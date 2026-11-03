import { createAgent } from "langchain";
import { MemorySaver, type BaseCheckpointSaver } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { loadModel } from "./models/model-loader";
import { SYSTEM_PROMPT } from "./prompts/system.prompt.ts";
import { currencyConversionTool } from "./tools/currency-conversion.tool.ts";
import { calculatorTool } from "./tools/calculator.tool";
import "dotenv/config";
import { weatherInfoTool } from "./tools/weather-info.tool.ts";
import { placeSearchTool } from "./tools/place-search.tool.ts";
import { AgentOptions } from "./schemas/agent-options.type.ts";

export function createTripPlannerAgent(opts: AgentOptions) {
    const search = new TavilySearch({
        tavilyApiKey: opts.tavilyApiKey,
        searchDepth: "basic",
        maxResults: 3,
    });

    return createAgent({
        model: loadModel({
            model: opts.model,
            thinking: opts.thinking,
            baseUrl: opts.ollamaBaseUrl,
        }),
        tools: [
            search,
            currencyConversionTool,
            calculatorTool,
            weatherInfoTool,
            placeSearchTool(opts.GEOAPIFY_API_KEY),
        ],
        systemPrompt: opts.systemPrompt,
        checkpointer: opts.checkpointer ?? new MemorySaver(),
        responseFormat: opts.responseFormat,
    });
}

export type TripAgent = ReturnType<typeof createTripPlannerAgent>;
