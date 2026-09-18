import { createDeepAgent, FilesystemBackend, StateBackend } from "deepagents";
import { ChatOllama } from "@langchain/ollama";
import { internetSearch } from "./tools";
import { researchInstructions } from "./system-prompt";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";

const llm = new ChatOpenAI({
    model: "qwen2.5:7b-instruct",
    temperature: 0,
    configuration: {
        baseURL: "http://localhost:11434/v1",
        apiKey: "ollama", // dummy, Ollama ignores it
    },
});

const backend = new FilesystemBackend({
    rootDir: process.cwd(),
    virtualMode: true,
});

//creating the deep agent
const deepAgent = createDeepAgent({
    model: llm,
    tools: [internetSearch],
    backend: backend,
    checkpointer: new MemorySaver(),
    systemPrompt:
        researchInstructions +
        "Always cite resources. Use Subagents for parallel research on different topics.",
    skills: ["/skills/"],
});

const config = { configurable: { thread_id: "skills-demo-1" } };

const result = await deepAgent.invoke(
    {
        messages: [
            {
                role: "user",
                content:
                    "What skills do you have and when will you use either of them??",
            },
        ],
    },
    config,
);
console.log(result.messages[result.messages.length - 1].content);

const config2 = { configurable: { thread_id: "skills-demo-2" } };

const result2 = await deepAgent.invoke(
    {
        messages: [
            {
                role: "user",
                content:
                    "how do i build a langgraph graph with conditional routing and memory?" +
                    "Show me a minimal code",
            },
        ],
    },
    config2,
);
console.log(result2.messages[result2.messages.length - 1].content);
