import { createDeepAgent, SubAgent } from "deepagents";
import { internetSearch } from "./tools";
import { researchInstructions } from "./system-prompt";
import { ChatOpenAI } from "@langchain/openai";
import { toolStrategy } from "langchain";
import { z } from "zod/v4";

const llm = new ChatOpenAI({
    model: "qwen2.5:7b-instruct",
    temperature: 0,
    configuration: {
        baseURL: "http://localhost:11434/v1",
        apiKey: "ollama", // dummy, Ollama ignores it
    },
});

const ResearchFindings = z.object({
    summary: z.string().describe("Summary of findings"),
    confidence: z.number().describe("Confidence score from 0 to 1"),
    sources: z.array(z.string()).describe("List of source URLs"),
});

const researchSubAgent: SubAgent = {
    name: "Research-Agent",
    description:
        "An Agent to used to research about topics in much more detail.",
    systemPrompt: researchInstructions,
    tools: [internetSearch],
    responseFormat: toolStrategy(ResearchFindings),
};

const deepAgent = createDeepAgent({
    model: llm,
    subagents: [researchSubAgent],
});

const result = await deepAgent.invoke({
    messages: [
        {
            role: "human",
            content: "Research about recent advancements in quantum computing",
        },
    ],
});

console.log(result);
