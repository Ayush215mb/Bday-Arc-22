import { Hono } from "hono";
import { cors } from "hono/cors";
import { createTripPlannerAgent } from "@trip-planner/agent";
import { env } from "./env";
import { tripRoutes } from "./routes/trip";
import { ItinerarySchema, existingModels } from "@trip-planner/agent/schemas";
import { loadDeepseek } from "@trip-planner/agent/models";

const model = loadDeepseek({
    model: existingModels.deepseek,
    apikey: env.DEEPSEEK_API_KEY,
    baseUrl: env.DEEPSEEK_BASE_URL,
});

const agent = createTripPlannerAgent({
    tavilyApiKey: env.TAVILY_API_KEY,
    GEOAPIFY_API_KEY: env.GEOAPIFY_API_KEY!,
    responseFormat: ItinerarySchema,
    model: model,
});

export const app = new Hono()
    .use(cors())
    .get("/health", (c) => c.json({ ok: true }))
    .route("/trip", tripRoutes(agent));
