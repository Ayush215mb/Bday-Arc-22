import { HumanMessage, SystemMessage } from "langchain";
import { ToolMessage } from "@langchain/core/messages";
import { S } from "./state";
import { loadDeepseek, loadModel } from "../models/model-loader";
import { createTripPlannerAgent } from "../agent";
import { DRAFT_PROMPT } from "../prompts/draft.prompt";
import { RESEARCH_PROMPT } from "../prompts/research.prompt";
import { EXTRACT_PROMPT } from "../prompts/extract.prompt";
import { PLAN_PROMPT } from "../prompts/plan.prompt";
import {
    existingModels,
    ItinerarySchema,
    ResearchSchema,
    DraftResponseSchema,
} from "../schemas";
import { itineraryToMarkdown } from "../utils/itinerary-to-markdown";
import { interestsNeedLiveSearch } from "../utils/categories";
import { prefetchPlaces } from "../services/preFetchPlaces";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY is not set");
}
if (!GEOAPIFY_API_KEY) {
    throw new Error("GEOAPIFY_API_KEY is not set");
}
if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not set");
}

export const draft_node = async (state: S) => {
    const draft_model = loadDeepseek({
        model: existingModels.deepseek,
        apikey: DEEPSEEK_API_KEY,
    }).withStructuredOutput(DraftResponseSchema);

    if (!state.userInput) throw new Error("User Query not found");

    const result = await draft_model.invoke([
        new SystemMessage(DRAFT_PROMPT),
        //...state.messages
        new HumanMessage(state.userInput),
    ]);

    return { request: result };
};

export const research_node = async (state: S) => {
    if (!state.request) throw new Error("Draft request not found");
    const { destination, interests } = state.request;
    const tripJson = JSON.stringify(state.request, null, 2);

    if (!destination) throw new Error("destination not found");

    const { perInterest, hotels } = await prefetchPlaces(
        destination,
        interests,
        GEOAPIFY_API_KEY,
    );
    const needsLiveSearch = interestsNeedLiveSearch(interests);

    const dataBlock = `needsLiveSearch: ${needsLiveSearch}

   Places already fetched per interest (do NOT search for places again):
   ${JSON.stringify(perInterest, null, 2)}

   Hotel candidates (no prices available):
   ${JSON.stringify(hotels, null, 2)}`;

    const finalModel = loadDeepseek({
        model: existingModels.deepseek,
        apikey: DEEPSEEK_API_KEY,
    });

    // Phase 1: tool loop (model calls tools, results feed back, until it stops)
    const agent = createTripPlannerAgent({
        tavilyApiKey: TAVILY_API_KEY!,
        GEOAPIFY_API_KEY: GEOAPIFY_API_KEY!,
        model: finalModel,
        thinking: false,
        responseFormat: ItinerarySchema,
    });

    const run = await agent.invoke(
        {
            messages: [
                new SystemMessage(RESEARCH_PROMPT),
                new HumanMessage(`Trip request:\n${tripJson}\n\n${dataBlock}`),
            ],
        },
        {
            recursionLimit: 30,
        },
    );

    const summary = String(run.messages.at(-1)?.content ?? "");
    const toolOutputs = run.messages
        .filter((m) => ToolMessage.isInstance(m))
        .map((m) => `[${m.name}] ${m.content}`)
        .join("\n\n");

    // Phase 2: no tools, structured output only
    const extractor = loadModel({
        model: existingModels.qwen,
        thinking: false,
    }).withStructuredOutput(ResearchSchema);

    const research = await extractor.invoke([
        new SystemMessage(EXTRACT_PROMPT),
        new HumanMessage(
            `Trip request:\n${tripJson}\n\n${dataBlock}\n\nResearch summary:\n${summary}\n\nRaw tool outputs:\n${toolOutputs}`,
        ),
    ]);

    return { research: research };
};

export const plan_node = async (state: S) => {
    if (!state.request || !state.research) {
        throw new Error("plan_node needs request and research");
    }

    const planner = loadDeepseek({
        model: existingModels.deepseek,
        apikey: DEEPSEEK_API_KEY,
    }).withStructuredOutput(ItinerarySchema);

    const messages = [
        new SystemMessage(PLAN_PROMPT),
        new HumanMessage(
            `Trip request:\n${JSON.stringify(state.request, null, 2)}\n\nResearch:\n${JSON.stringify(state.research, null, 2)}`,
        ),
    ];

    let itinerary = await planner.invoke(messages);

    // cheap guardrail: day count must match the request
    const wantedDays = state.request.days;
    if (itinerary.days.length !== wantedDays) {
        itinerary = await planner.invoke([
            ...messages,
            new HumanMessage(
                `Your plan had ${itinerary.days.length} days; it must have exactly ${wantedDays}. Regenerate the full plan.`,
            ),
        ]);
    }

    return {
        itinerary,
        response: itineraryToMarkdown(itinerary, state.research),
    };
};
