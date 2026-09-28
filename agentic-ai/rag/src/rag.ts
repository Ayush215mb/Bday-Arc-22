import { ChatOllama } from "@langchain/ollama";
import { retriever } from "./embedding";
import { z } from "zod";

const model = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});

async function simple_rag(query: string, top_k: number, llm: ChatOllama) {
    const results = await retriever(query, top_k);

    if (results.length === 0) {
        return "No relevant context about this";
    }
    const context = results
        .map(
            (r, i) =>
                `[${i + 1}] (${r.metadata?.source}, p.${r.metadata?.page})\n${r.text}`,
        )
        .join("\n\n---\n\n");
    const prompt = `use the following context to answer the question concisely
        context:
        ${context}

        question:
        ${query}

        `;

    const response = await llm.invoke(prompt);

    return response.content;
}

// const res = await simple_rag("who is Ayush Yadav", 2, model);

// const res = await simple_rag("who is Prince raj", 2, model);

// const res = await simple_rag("who is Ankit Das", 2, model);

// const res = await simple_rag(
//     `Has ayush yadav published any automated digital forensic tool for social media data extraction ??`,
//     4,
//     model,
// );

// console.log("\n\n", res);

const RagAnswer = z.object({
    answer: z
        .string()
        .describe("Concise answer using only the context. If missing, say so."),
    answerable: z
        .boolean()
        .describe("true only if the context actually contains the answer"),
    used_chunks: z
        .array(z.number())
        .describe("1-based numbers of the context chunks you used"),
    llm_confidence: z
        .number()
        .min(0)
        .max(1)
        .describe("Your confidence the answer is correct, 0 to 1"),
});

const SIM_GOOD = 0.6; // similarity treated as a "strong" match, tune on your data

async function advanced_rag(query: string, top_k: number, llm: ChatOllama) {
    const results = await retriever(query, top_k);

    if (results.length === 0) {
        return {
            answer: "No relevant context found.",
            confidence: 0,
            sources: [],
        };
    }

    const context = results
        .map(
            (r, i) =>
                `[${i + 1}] (${r.metadata?.source}, p.${r.metadata?.page})\n${r.text}`,
        )
        .join("\n\n---\n\n");

    const structured = llm.withStructuredOutput(RagAnswer);

    const out = await structured.invoke(
        `Answer the question using only the context below. Be concise.
        If the answer is not in the context, set answerable=false.

        Context:
        ${context}

        Question: ${query}`,
    );

    const sources = out.used_chunks
        .filter((n) => n >= 1 && n <= results.length)
        .map((n) => {
            const r = results[n - 1];
            return {
                source: r.metadata?.source,
                page: r.metadata?.page,
                similarity: Number((1 - (r.distance ?? 2) / 2).toFixed(3)),
                snippet: r.text.slice(0, 200),
            };
        });

    const bestSim = Math.max(0, ...sources.map((s) => s.similarity));
    const retrievalConf = Math.min(1, bestSim / SIM_GOOD);

    const confidence = out.answerable
        ? Number(Math.min(out.llm_confidence, retrievalConf).toFixed(2))
        : 0;

    return { answer: out.answer, confidence, sources };
}

// console.log(
//     JSON.stringify(await advanced_rag("Who is Prince Raj?", 4, model), null, 2),
// );

console.log(
    JSON.stringify(
        await advanced_rag("Who is Ayush Yadav?", 4, model),
        null,
        2,
    ),
);
