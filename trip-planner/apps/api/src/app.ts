import { Hono } from "hono";
import { cors } from "hono/cors";
import { createTripPlannerAgent } from "@trip-planner/agent";
import { env } from "./env";
import { tripRoutes } from "./routes/trip";

const agent = createTripPlannerAgent({
    tavilyApiKey: env.TAVILY_API_KEY,
    ollamaBaseUrl: env.OLLAMA_BASE_URL,
    openTripMapApiKey: env.OPEN_TRIP_API_KEY!,
});

export const app = new Hono()
    .use(cors())
    .get("/health", (c) => c.json({ ok: true }))
    .route("/trip", tripRoutes(agent));
