import { Hono } from "hono";
import { cors } from "hono/cors";
import { createTripPlannerAgent } from "@trip-planner/agent";
import { env } from "./env";
import { tripRoutes } from "./routes/trip";
import { ItinerarySchema, existingModels } from "@trip-planner/agent/schemas";

const agent = createTripPlannerAgent({
    tavilyApiKey: env.TAVILY_API_KEY,
    ollamaBaseUrl: env.OLLAMA_BASE_URL,
    GEOAPIFY_API_KEY: env.GEOAPIFY_API_KEY!,
    responseFormat: ItinerarySchema,
    model: existingModels.qwen,
    thinking: false,
});

export const app = new Hono()
    .use(cors())
    .get("/health", (c) => c.json({ ok: true }))
    .route("/trip", tripRoutes(agent));
