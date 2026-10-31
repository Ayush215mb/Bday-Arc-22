import { createTripPlannerAgent } from ".";
import { existingModels } from "./models/existingModels";
import { ItinerarySchema } from "./schemas/trip.response.schema";

const config = { configurable: { thread_id: "session-3" }, recursionLimit: 60 };

const result = createTripPlannerAgent({
    tavilyApiKey: process.env.TAVILY_API_KEY!,
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY!,
    model: existingModels.gemma,
    responseFormat: ItinerarySchema,
}).invoke(
    {
        messages: [
            {
                role: "user",
                content: "plan a 2 day trip to japan in 3 lakhs INR ",
            },
        ],
    },
    config,
);

console.log(await result);
