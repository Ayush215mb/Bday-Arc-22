import { createTripPlannerAgent } from ".";
import { TripRequest } from "./graph/state";
import { existingModels } from "./models/existingModels";
import { loadModel } from "./models/model-loader";
import { DRAFT_PROMPT } from "./prompts/draft.prompt";
import { ItinerarySchema } from "./schemas/trip.response.schema";
import { HumanMessage, AIMessage, SystemMessage } from "langchain";

const config = { configurable: { thread_id: "session-3" }, recursionLimit: 60 };

// const result = createTripPlannerAgent({
//     tavilyApiKey: process.env.TAVILY_API_KEY!,
//     GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY!,
//     model: existingModels.gemma,
//     responseFormat: ItinerarySchema,
// }).invoke(
//     {
//         messages: [
//             {
//                 role: "user",
//                 content: "plan a 2 day trip to japan in 3 lakhs INR ",
//             },
//         ],
//     },
//     config,
// );

const conversation = [
    new SystemMessage(DRAFT_PROMPT),
    new HumanMessage(
        "Plan a 2-day trip to Kyoto for 2 people from december. Budget JPY 291000 Interested in temples, food, and one live show if anything is on.",
    ),
];

const draft_model = loadModel({ model: existingModels.qwen, thinking: false });

const structured_draft_model = draft_model.withStructuredOutput(TripRequest);
const result = await structured_draft_model.invoke(conversation);

console.log(result);
