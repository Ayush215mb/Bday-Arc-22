import { embed, embedMany } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function generateEmbedding(text: string) {
    const input = text.replace("/n", " ");

    const { embedding } = await embed({
        model: google.embedding("gemini-embedding-001"),
        value: input,
    });

    return embedding;
}

export async function generateEmbeddings(texts: string[]) {
    const inputs = texts.map((text) => text.replace("/n", " "));

    const { embeddings } = await embedMany({
        model: google.embedding("gemini-embedding-001"),
        values: inputs,
    });

    return embeddings;
}
