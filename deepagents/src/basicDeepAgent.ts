import { createDeepAgent } from "deepagents";
import { ChatOllama } from "@langchain/ollama";
import { internetSearch } from "./tools";
import { researchInstructions } from "./system-prompt";

const llm = new ChatOllama({
    model: "qwen2.5:7b-instruct",
    temperature: 0,
});

//creating the deep agent
const deepAgent = createDeepAgent({
    model: llm,
    tools: [internetSearch],
    systemPrompt: researchInstructions,
});

const result = await deepAgent.invoke({
    messages: [{ role: "user", content: "What is langgraph?" }],
});
console.log(result.messages[result.messages.length - 1].content);
