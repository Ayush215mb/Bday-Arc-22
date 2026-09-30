import { ChatOllama } from "@langchain/ollama";
import { traceable } from "langsmith/traceable";
import "dotenv/config";

const llm = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});

const getContext = traceable(
    async function getContext(question: string): Promise<string> {
        // trace this as a tool span
        // In a real app, this would query a knowledge base or vector store
        return "LangSmith traces are stored for 14 days on the Developer plan.";
    },
    { run_type: "tool" },
);

const assistant = traceable(async function assistant(question: string) {
    // capture the full pipeline as a single trace
    const context = await getContext(question);
    const response = await llm.invoke([
        {
            role: "system",
            content: `Answer using the context below.\n\nContext: ${context} `,
        },
        { role: "user", content: question },
    ]);
    return response.text ?? null;
});

(async () => {
    console.log(await assistant("How long are LangSmith traces stored?"));
})();
