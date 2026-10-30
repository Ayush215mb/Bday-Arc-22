import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { zValidator } from "@hono/zod-validator";
import type { TripAgent } from "@trip-planner/agent";
import { planSchema } from "../schemas/plan.js";

export const tripRoutes = (agent: TripAgent) =>
    new Hono()
        .post("/plan", zValidator("json", planSchema), async (c) => {
            const { threadId, message } = c.req.valid("json");
            const result = await agent.invoke(
                { messages: [{ role: "user", content: message }] },
                { configurable: { thread_id: threadId }, recursionLimit: 60 },
            );
            const last = result.messages.at(-1);
            return c.json({ threadId, reply: last?.content });
        })
        .post("/stream", zValidator("json", planSchema), (c) => {
            const { threadId, message } = c.req.valid("json");
            return streamSSE(c, async (stream) => {
                const events = await agent.stream(
                    { messages: [{ role: "user", content: message }] },
                    {
                        configurable: { thread_id: threadId },
                        streamMode: "messages",
                    },
                );
                for await (const [chunk] of events) {
                    if (typeof chunk.content === "string" && chunk.content) {
                        await stream.writeSSE({
                            event: "token",
                            data: chunk.content,
                        });
                    }
                }
                await stream.writeSSE({ event: "done", data: threadId });
            });
        });
