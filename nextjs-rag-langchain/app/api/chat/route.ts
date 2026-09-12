import {
    streamText,
    convertToModelMessages,
    UIMessage,
    generateText,
    createUIMessageStreamResponse,
    toUIMessageStream,
    tool,
    InferUITool,
    InferUITools,
    UIDataTypes,
    stepCountIs,
} from "ai";
import z from "zod";
import { createGoogle, createGoogleGenerativeAI } from "@ai-sdk/google";

import "dotenv/config";
import { searchDocument } from "@/lib/search";
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});
export const maxDuration = 30;

const tools = {
    searchKnowledgeBase: tool({
        description: "Search the knowledge for relevant information",
        inputSchema: z.object({
            query: z
                .string()
                .describe("The search query to find relevant documents"),
        }),
        execute: async ({ query }) => {
            try {
                const result = await searchDocument(query, 3, 0.5);

                if (result.length === 0)
                    return "No relevent information found in knowledge base";

                const formattedResult = result
                    .map(
                        (r, i) => `
                    [${i + 1}] ${r.content} `,
                    )
                    .join("\n\n");

                return formattedResult;
            } catch (error) {
                console.error("erro while searching", error);
                return "Error while searching the document";
            }
        },
    }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
        model: google.interactions("gemini-3.5-flash"),
        instructions:
            "You are a helpful assistant with access to a knowledge base. When users ask question, search the knowledge base before answering to find relevant information. Try to keep your response under 30-40 words ",
        messages: await convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(2),
    });

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
    });
}
