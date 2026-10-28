import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { MemorySaver } from "@langchain/langgraph";
import { createTripPlannerAgent } from "@trip-planner/agent";

const agent = createTripPlannerAgent({
    tavilyApiKey: process.env.TAVILY_API_KEY!,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
    checkpointer: new MemorySaver(),
});

const threadId = crypto.randomUUID();
const rl = createInterface({ input: process.stdin, output: process.stdout });

console.log("Trip planner CLI. Type 'exit' to quit.\n");

while (true) {
    const message = (await rl.question("you> ")).trim();
    if (!message) continue;
    if (message === "exit") break;

    const events = await agent.stream(
        { messages: [{ role: "user", content: message }] },
        { configurable: { thread_id: threadId }, streamMode: "messages" },
    );

    process.stdout.write("agent> ");
    for await (const [chunk] of events) {
        if (typeof chunk.content === "string")
            process.stdout.write(chunk.content);
    }
    console.log("\n");
}

rl.close();
