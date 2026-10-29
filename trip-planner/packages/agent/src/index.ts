import { createAgent } from "langchain";
import { MemorySaver, type BaseCheckpointSaver } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { existingModels, loadModel } from "./models/model-loader";
import { SYSTEM_PROMPT } from "./prompts/system-prompt.ts";
import { currencyConversionTool } from "./tools/currency-conversion.tool.ts";
import { calculatorTool } from "./tools/calculator.tool";
import "dotenv/config";
import { weatherInfoTool } from "./tools/weather-info.tool.ts";
import { placeSearchTool } from "./tools/place-search.tool.ts";
export interface AgentOptions {
    tavilyApiKey?: string;
    openTripMapApiKey: string;
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
        tools: [
            search,
            currencyConversionTool,
            calculatorTool,
            weatherInfoTool,
            placeSearchTool(opts.openTripMapApiKey),
        ],
        systemPrompt: SYSTEM_PROMPT,
        checkpointer: opts.checkpointer ?? new MemorySaver(),
    });
}

export type TripAgent = ReturnType<typeof createTripPlannerAgent>;

// const config = { configurable: { thread_id: "session-2" } };

// const result = createTripPlannerAgent({
//     tavilyApiKey: process.env.TAVILY_API_KEY!,
//     openTripMapApiKey: process.env.OPEN_TRIP_API_KEY!,
//     model: existingModels.gemma,
// }).invoke(
//     {
//         messages: [
//             {
//                 role: "user",
//                 content:
//                     "Plan a 15 day trip for 5 people in INDIA under the budget of $10000. Include all the famous tourist spots, live shows, sports event if any and cultural heritages. we are planing the trip from 01 dec 2026 to 16 dec 2026.",
//             },
//         ],
//     },
//     config,
// );

// console.log(await result);
