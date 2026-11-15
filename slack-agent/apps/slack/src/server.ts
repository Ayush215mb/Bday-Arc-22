import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bot } from "./bot";

const app = new Hono();

app.post("/api/webhooks/slack", (c) =>
    bot.webhooks.slack(c.req.raw, {
        waitUntil: (task) => {
            task.catch(console.error);
        },
    }),
).get("/", (c) => {
    return c.body("Healthy");
});

export default app;

if (!process.env.VERCEL) {
    serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, (i) => {
        console.log("Server running at port ", i.port);
    });
}
