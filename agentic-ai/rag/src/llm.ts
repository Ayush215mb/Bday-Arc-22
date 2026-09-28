import { ChatOllama } from "@langchain/ollama";
import { retriever } from "./embedding";

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

    console.log("\n\nresults:", results);
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

    console.log("response of llm", response);

    return response.content;
}

// const res = await simple_rag("who is Prince raj", 2, model);

// const res = await simple_rag("who is Ankit Das", 2, model);

const res = await simple_rag(
    "ayush has published any research paper along with prince raj or ankit das?",
    4,
    model,
);

console.log(res);
