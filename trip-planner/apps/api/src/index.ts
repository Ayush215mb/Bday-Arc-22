import { serve } from "@hono/node-server";
import { app } from "./app";
import { env } from "./env";

serve({ fetch: app.fetch, port: env.PORT }, (i) =>
    console.log(`API on http://localhost:${i.port}`),
);

import { createTripPlannerAgent } from "@trip-planner/agent";
console.log(typeof createTripPlannerAgent); // "function"
