import { serve } from "@hono/node-server";
import {
    createUIMessageStreamResponse,
    generateText,
    streamText,
    toUIMessageStream,
} from "ai";
import { Hono } from "hono";
import { deepSeekModel } from ".";

const app = new Hono();

app.post("/", async (c) => {
    const result = await generateText({
        model: deepSeekModel("deepseek/deepseek-v4.1-flash"),
        prompt: "Invent a new holiday and describe its traditions.",
    });

    return c.text(result.text);
}).post("/stream", async (c) => {
    const result = streamText({
        model: deepSeekModel("deepseek/deepseek-v4.1-flash"),
        prompt: "Invent a new holiday and describe its traditions.",
    });
    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
    });
});

serve({ fetch: app.fetch, port: 8080 }, (i) => {
    console.log("server running at PORT", i.port);
});
