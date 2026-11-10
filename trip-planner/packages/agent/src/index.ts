import { loadDeepseek, loadModel } from "./models/model-loader";
import {
    DraftResponseSchema,
    existingModels,
    ItinerarySchema,
} from "./schemas";
import { HumanMessage, SystemMessage } from "langchain";
import { convertCurrency } from "./services/currency-converter";
import { prefetchPlaces } from "./services/preFetchPlaces";
import { DRAFT_PROMPT } from "./prompts/draft.prompt";
import { PLAN_PROMPT } from "./prompts/plan.prompt";
import { WebSearchTool } from "./tools/web-search.tool";
import { createTripPlannerAgent } from "./agent";
import {} from "./schemas/itinerary.response.schema";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";
import { currencyConversionTool } from "./tools";

// const draftModel = loadModel({
//     model: existingModels.qwen,
//     thinking: false,
// }).withStructuredOutput(DraftResponseSchema);
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

if (!DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not found");
if (!TAVILY_API_KEY) throw new Error("TAVILY_API_KEY not found");
if (!GEOAPIFY_API_KEY) throw new Error("GEOAPIFY_API_KEY not found");

const draftModel = loadDeepseek({
    model: existingModels.deepseek,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    apikey: DEEPSEEK_API_KEY,
}).withStructuredOutput(DraftResponseSchema);

const finalModel = loadDeepseek({
    model: existingModels.deepseek,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    apikey: process.env.DEEPSEEK_API_KEY!,
});

export const TestAgent = async (prompt: string) => {
    if (!prompt?.trim()) throw new Error("Prompt is empty");
    // const firstDraft = await draftModel.invoke([
    //     new SystemMessage(DRAFT_PROMPT),
    //     new HumanMessage(prompt),
    // ]);

    // const [places, fx] = await Promise.all([
    //     prefetchPlaces(
    //         firstDraft.destination!,
    //         firstDraft.interests!,
    //         GEOAPIFY_API_KEY,
    //     ),
    //     convertCurrency(
    //         firstDraft.budget!,
    //         firstDraft.currency!,
    //         firstDraft.localCurrency!,
    //     ),
    // ]);

    const config = { configurable: { thread_id: "Deepseekagent-003" } };

    const result = await finalModel
        .bindTools([currencyConversionTool, prefetchPlaces])
        .invoke(
            [new SystemMessage(SYSTEM_PROMPT), new HumanMessage(` ${prompt}`)],
            config,
        );

    return result;
};

const ReActAgent = createTripPlannerAgent({
    tavilyApiKey: TAVILY_API_KEY,
    model: finalModel,
    responseFormat: ItinerarySchema,
    systemPrompt: SYSTEM_PROMPT,
});

const result = await TestAgent(
    "Plan a 3-day trip to Brazil for 2 people in December. Budget INR 800,000. Interested in temples, food, and one live show if anything is on.",
);

//     .invoke({
//     messages: [
//         new HumanMessage(
//             "Plan a 3-day trip to Brazil for 2 people in December. Budget INR 800,000. Interested in temples, food, and one live show if anything is on.",
//         ),
//     ],
// });

console.log(result);
