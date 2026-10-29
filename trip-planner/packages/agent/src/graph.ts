import { createTripPlannerAgent } from "./index.js";
import "dotenv/config";

export const graph = createTripPlannerAgent({
    tavilyApiKey: process.env.TAVILY_API_KEY!,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
    openTripMapApiKey: process.env.OPEN_TRIP_API_KEY!,
});
