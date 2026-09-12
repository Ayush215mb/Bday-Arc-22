import {
    streamText,
    convertToModelMessages,
    UIMessage,
    generateText,
    createUIMessageStreamResponse,
    toUIMessageStream,
} from "ai";

import { createGoogle, createGoogleGenerativeAI } from "@ai-sdk/google";

import "dotenv/config";
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: google.interactions("gemini-3.6-flash"),
        instructions: "Reply in less than 10 words.",
        messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
    });
}
