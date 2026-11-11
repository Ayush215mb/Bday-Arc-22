import { createAgent } from "langchain";
import { type AgentOptions } from "./schemas";
import { MemorySaver } from "@langchain/langgraph";
import {
    currencyConversionTool,
    calculatorTool,
    placeSearchTool,
} from "./tools";
import { WebSearchTool } from "./tools/web-search.tool";

export function createTripPlannerAgent(opts: AgentOptions) {
    return createAgent({
        model: opts.model,
        tools: [
            WebSearchTool(opts.tavilyApiKey!, "basic"),
            currencyConversionTool,
            calculatorTool,
            placeSearchTool(opts.GEOAPIFY_API_KEY!),
        ],
        systemPrompt: opts.systemPrompt,
        checkpointer: opts.checkpointer ?? new MemorySaver(),
        responseFormat: opts.responseFormat,
    });
}

export type TripAgent = ReturnType<typeof createTripPlannerAgent>;
