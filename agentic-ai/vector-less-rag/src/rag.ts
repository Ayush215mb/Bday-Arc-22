import { retrieveFromPageIndex } from "./retrieveDocument";
import { ChatOllama } from "@langchain/ollama";

const model = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});

export async function vectorless_rag(query: string, docId: string) {
    const context = await retrieveFromPageIndex(query, docId);

    if (context.length == 0) return "No relevant context found.";

    // const combined_context = context.map;

    const prompt = `
        You are a research assistant.
        Answer ONLY using the context below.
        If the answer is not found, say "Not found in document."

        Context:
        ${context}

        Question:
        ${query}
        `;

    const response = await model.invoke(prompt);
    return response.content;
}

const query = "What is the syllabus of Operating System?";
const doc_id = process.env.DOC_ID;
if (!doc_id) throw new Error("doc id not found");
const answer = await vectorless_rag(query, doc_id);

console.log("\n\n", answer);
