import { loadDeepseek, loadModel } from "./models/model-loader";
import { DraftResponseSchema, existingModels } from "./schemas";
import { HumanMessage, SystemMessage } from "langchain";
import { convertCurrency } from "./services/currency-converter";
import { prefetchPlaces } from "./services/preFetchPlaces";

import { DRAFT_PROMPT } from "./prompts/draft.prompt";
import { PLAN_PROMPT } from "./prompts/plan.prompt";

import { WebSearchTool } from "./tools/web-search.tool";

const draftModel = loadModel({
    model: existingModels.qwen,
    thinking: false,
}).withStructuredOutput(DraftResponseSchema);

const finalModel = loadDeepseek({
    model: existingModels.deepseek,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    apikey: process.env.DEEPSEEK_API_KEY!,
}).bindTools([WebSearchTool]);
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

if (!GEOAPIFY_API_KEY) throw new Error("GEOAPIFY_API_KEY not found");

export const TestAgent = async (prompt: string) => {
    if (!prompt?.trim()) throw new Error("Prompt is empty");
    const firstDraft = await draftModel.invoke([
        new SystemMessage(DRAFT_PROMPT),
        new HumanMessage(prompt),
    ]);

    const [places, fx] = await Promise.all([
        prefetchPlaces(
            firstDraft.destination!,
            firstDraft.interests!,
            GEOAPIFY_API_KEY,
        ),
        convertCurrency(
            firstDraft.budget!,
            firstDraft.currency!,
            firstDraft.localCurrency!,
        ),
    ]);

    const config = { configurable: { thread_id: "testAgent-001" } };

    const result = await finalModel.invoke(
        [
            new SystemMessage(PLAN_PROMPT),
            new HumanMessage(
                `I'm planning to go to ${firstDraft.destination} for ${firstDraft.days} with a budget of ${fx}. I'm interested in going to places like ${JSON.stringify(places, null, 2)} and I want to make the trip from ${firstDraft.startDate} to ${firstDraft.endDate}. EXTRA INFO: ${prompt}`,
            ),
        ],
        config,
    );

    return result;
};

const result = await TestAgent(
    "Plan a 3-day trip to Kyoto for 2 people in December. Budget INR 800,000. Interested in temples, food, and one live show if anything is on.",
);

console.log(result);
