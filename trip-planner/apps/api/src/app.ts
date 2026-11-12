import { Hono } from "hono";
import { cors } from "hono/cors";
import { createTripPlannerAgent } from "@trip-planner/agent";
import { tripRoutes } from "./routes/trip";
import { ItinerarySchema, existingModels } from "@trip-planner/agent/schemas";
import { loadDeepseek } from "@trip-planner/agent/models";

const model = loadDeepseek({
    model: existingModels.deepseek,
    apikey: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
});

const agent = createTripPlannerAgent({
    tavilyApiKey: process.env.TAVILY_API_KEY,
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY!,
    responseFormat: ItinerarySchema,
    model: model,
});
const app = new Hono()
    .use(cors())
    .get("/", (c) => c.text("Hello from Hono"))
    .get("/health", (c) => c.json({ ok: true }))
    .route("/trip", tripRoutes(agent));

export default app;
