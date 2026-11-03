import { existingModels } from "../models/existingModels";
import { loadModel } from "../models/model-loader";
import { HumanMessage, SystemMessage } from "langchain";
import { S } from "./state";
import { DraftResponseSchema } from "../schemas/draft.response.schema";
import { DRAFT_PROMPT } from "../prompts/draft.prompt";
import { ToolMessage } from "@langchain/core/messages";
import { RESEARCH_PROMPT } from "../prompts/research.prompt";
import { createTripPlannerAgent } from "..";
import { ItinerarySchema } from "../schemas/itinerary.response.schema";
import { ResearchSchema } from "../schemas/research.response.schema";
import { EXTRACT_PROMPT } from "../prompts/extract.prompt";
import { PLAN_PROMPT } from "../prompts/plan.prompt";
import { itineraryToMarkdown } from "../utils/itinerary-to-markdown";
import { mapInterestsToGeoapify, interestsNeedLiveSearch } from "./categories";
import { findFamousPlaces } from "../services/find-famous-places";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

if (!TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY is not set");
}
if (!GEOAPIFY_API_KEY) {
    throw new Error("GEOAPIFY_API_KEY is not set");
}

async function prefetchPlaces(destination: string, interests: string[]) {
    const perInterest = await Promise.all(
        interests.map(async (interest) => {
            try {
                const { places } = await findFamousPlaces({
                    destination,
                    apiKey: GEOAPIFY_API_KEY!,
                    categories: mapInterestsToGeoapify([interest]), // one interest at a time
                    limit: 5,
                });
                return { interest, places };
            } catch (e) {
                return { interest, places: [], error: String(e) };
            }
        }),
    );

    const hotels = await findFamousPlaces({
        destination,
        apiKey: GEOAPIFY_API_KEY!,
        categories: ["accommodation.hotel"],
        limit: 6,
    })
        .then((r) => r.places)
        .catch(() => []);

    return { perInterest, hotels };
}

export const draft_node = async (state: S) => {
    const draft_model = loadModel({
        model: existingModels.qwen,
        thinking: false,
    }).withStructuredOutput(DraftResponseSchema);

    // if (!state.userInput) throw new Error("User Query not found");

    const result = await draft_model.invoke([
        new SystemMessage(DRAFT_PROMPT),
        ...state.messages,
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
    );
    const needsLiveSearch = interestsNeedLiveSearch(interests);

    const dataBlock = `needsLiveSearch: ${needsLiveSearch}

   Places already fetched per interest (do NOT search for places again):
   ${JSON.stringify(perInterest, null, 2)}

   Hotel candidates (no prices available):
   ${JSON.stringify(hotels, null, 2)}`;

    // Phase 1: tool loop (model calls tools, results feed back, until it stops)
    const agent = createTripPlannerAgent({
        tavilyApiKey: TAVILY_API_KEY!,
        GEOAPIFY_API_KEY: GEOAPIFY_API_KEY!,
        model: existingModels.gemma,
        thinking: false,
        responseFormat: ItinerarySchema,
        systemPrompt: RESEARCH_PROMPT,
    });

    const run = await agent.invoke(
        {
            messages: [
                new HumanMessage(`Trip request:\n${tripJson}\n\n${dataBlock}`),
            ],
        },
        { recursionLimit: 15 },
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

    return { research };
};

export const plan_node = async (state: S) => {
    if (!state.request || !state.research) {
        throw new Error("plan_node needs request and research");
    }

    const planner = loadModel({
        model: existingModels.qwen,
        thinking: false,
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
        itinerary, // JSON for your /plan cards
        response: itineraryToMarkdown(itinerary, state.research), // markdown fallback
    };
};

// // based on the user's preference, do the research about flights prices, weather, places, hotels and ask if need more info
// const research_node = async (state: S) => {
//     const webSearch = new TavilySearch({
//         tavilyApiKey: TAVILY_API_KEY,
//         searchDepth: "basic",
//         maxResults: 3,
//     });

//     const research_model = loadModel({
//         model: existingModels.gemma,
//         thinking: false,
//     });

//     const research_model_with_tools = research_model.bindTools([
//         calculatorTool,
//         currencyConversionTool,
//         placeSearchTool,
//         weatherInfoTool,
//         webSearch,
//     ]);

//     const result = research_model_with_tools.invoke([
//         new SystemMessage(`Tool rules:
//           - calculatorTool: USE this tool ALWAYS for any arithmetic or budget total.
//           - currencyConversionTool: USE this tool to convert the budget amount from currency to local currency.
//           - weatherInfoTool: USE this tool get the weather information of the destination during the travel time and inform if any natural disaster is likely to happen.
//           - placeSearchTool: USE this tool to find places according to the user interests.
//           - webSearch: Use this tool ONLY for live information which the other tools can't provide.

//           EXAMPLE_INPUT: {
//             destination: 'Kyoto, Japan',
//             days: 2,
//             startDate: 'April (Tentative)',
//             endDate: 'T+1',
//             budget: 200000,
//             currency: 'INR (₹)',
//             localCurrency: 'JPY (¥)',
//             interests: [ 'Temples', 'Food', 'Live Show (Traditional/Performance)' ]
//           }

//           `),
//         new HumanMessage(
//             `Trip request:\n${JSON.stringify(state.request, null, 2)}`,
//         ),
//     ]);
// };
