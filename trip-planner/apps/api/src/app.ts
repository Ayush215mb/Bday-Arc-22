import { Hono } from "hono";
import { cors } from "hono/cors";
import { createTripPlannerAgent } from "@trip-planner/agent";
import { env } from "./env";
import { tripRoutes } from "./routes/trip";
import { ItinerarySchema } from "./schemas/itinerary.schema";

const agent = createTripPlannerAgent({
    tavilyApiKey: env.TAVILY_API_KEY,
    ollamaBaseUrl: env.OLLAMA_BASE_URL,
    GEOAPIFY_API_KEY: env.GEOAPIFY_API_KEY!,
    responseFormat: ItinerarySchema,
    model: "gemma4:12b",
});

export const app = new Hono()
    .use(cors())
    .get("/health", (c) => c.json({ ok: true }))
    .route("/trip", tripRoutes(agent));
