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
import z from "zod";
export interface AgentOptions {
    tavilyApiKey?: string;
    GEOAPIFY_API_KEY: string;
    ollamaBaseUrl?: string;
    model?: string;
    checkpointer?: BaseCheckpointSaver;
    responseFormat: z.ZodObject;
}

export function createTripPlannerAgent(opts: AgentOptions) {
    const search = new TavilySearch({
        tavilyApiKey: opts.tavilyApiKey,
        searchDepth: "basic",
        maxResults: 3,
    });

    return createAgent({
        model: loadModel({ model: opts.model, baseUrl: opts.ollamaBaseUrl }),
        tools: [
            search,
            currencyConversionTool,
            calculatorTool,
            weatherInfoTool,
            placeSearchTool(opts.GEOAPIFY_API_KEY),
        ],
        systemPrompt: SYSTEM_PROMPT,
        checkpointer: opts.checkpointer ?? new MemorySaver(),
        responseFormat: opts.responseFormat,
    });
}

export type TripAgent = ReturnType<typeof createTripPlannerAgent>;

// const config = { configurable: { thread_id: "session-3" }, recursionLimit: 60 };

// const result = createTripPlannerAgent({
//     tavilyApiKey: process.env.TAVILY_API_KEY!,
//     GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY!,
//     model: existingModels.gemma,
//     responseFormat: z.object({
//         days: z.string().describe("eg. day 0, day 1 and so forth"),
//         activities: z.string().describe("activity planned for that day"),
//         cost: z.string().describe("the cost of that activity"),
//         location: z.string().describe("the location of the activity"),
//         time: z.string().describe("time allotted for the activity"),
//     }),
// }).invoke(
//     {
//         messages: [
//             {
//                 role: "user",
//                 content:
//                     "use the findplaces tool to find 5 places to visit in india. DO NOT USE TAVILY SEARCH",
//             },
//         ],
//     },
//     config,
// );

// console.log(await result);
