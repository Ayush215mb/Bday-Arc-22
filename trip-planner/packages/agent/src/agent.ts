import { createAgent } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import type { AgentOptions } from "./schemas";
import { loadModel } from "./models/model-loader";
import { MemorySaver } from "@langchain/langgraph";
import {
    currencyConversionTool,
    calculatorTool,
    weatherInfoTool,
    placeSearchTool,
} from "./tools";

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
