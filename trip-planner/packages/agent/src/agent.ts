import { type AgentOptions } from "./schemas";
import { MemorySaver } from "@langchain/langgraph";
import { createDeepAgent } from "deepagents";
import {
    currencyConversionTool,
    calculatorTool,
    placeSearchTool,
} from "./tools";
import { WebSearchTool } from "./tools/web-search.tool";

export function createTripPlannerAgent(opts: AgentOptions) {
    return createDeepAgent({
        model: opts.model,
        tools: [
            WebSearchTool(opts.tavilyApiKey!, "basic"),
            currencyConversionTool,
            calculatorTool,
            placeSearchTool(opts.GEOAPIFY_API_KEY!),
        ],
        systemPrompt: opts.systemPrompt,
        checkpointer: opts.checkpointer ?? new MemorySaver(),
        subagents: [
            {
                name: "researcher",
                description:
                    "Delegate one focused research task: gather key facts on a single topic. Use for parallel coverage of distinct subjects.",
                systemPrompt:
                    "You are a research specialist. Complete your assigned topic only. Return 3–5 bullet points with the most important facts. No preamble, no follow-up questions, and do not delegate further work.",
            },
            {
                name: "analyzer",
                description:
                    "Delegate one focused analysis task: pros, cons, and trade-offs for a single option or approach. Use when comparing alternatives in parallel.",
                systemPrompt:
                    "You are an analysis specialist. Complete your assigned option or angle only. Return 3–5 bullet points covering strengths, weaknesses, and key trade-offs. No preamble, no follow-up questions, and do not delegate further work.",
            },
            {
                name: "writer",
                description:
                    "Delegate one focused summary task: turn findings on a single subtopic into clear prose. Use when each parallel subagent should produce readable copy.",
                systemPrompt:
                    "You are a writing specialist. Complete your assigned subtopic only. Return a short paragraph or 3–5 bullets with the key takeaways. No preamble, no follow-up questions, and do not delegate further work.",
            },
        ],
    });
}

export type TripAgent = ReturnType<typeof createTripPlannerAgent>;
