import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { createTripPlannerAgent } from ".";
import { existingModels } from "./models/existingModels";
import { HumanMessage, AIMessage, SystemMessage } from "langchain";
import { ItineraryItemSchema } from "./schemas/itinerary.response.schema";

const config = { configurable: { thread_id: "test-001" }, recursionLimit: 60 };

const db_url = process.env.DIRECT_URL;

if (!db_url) throw new Error("db url not found");

const checkpointer = PostgresSaver.fromConnString(db_url, {
    schema: "langgraph",
});
await checkpointer.setup();

const result = await createTripPlannerAgent({
    tavilyApiKey: process.env.TAVILY_API_KEY!,
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY!,
    model: existingModels.gemma,
    thinking: false,
    systemPrompt: "",
    responseFormat: ItineraryItemSchema,
    checkpointer: checkpointer,
}).invoke(
    {
        messages: [
            new HumanMessage("plan a 2 day trip to japan in 3 lakhs INR"),
        ],
    },
    config,
);

console.log(result);
