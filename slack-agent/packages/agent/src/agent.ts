import * as ai from "ai";
import { wrapAISDK } from "langsmith/experimental/vercel";
import { AgentOptions } from "./types/agent-options.type";

export const Agent = (opts: AgentOptions) => {
    const { ToolLoopAgent } = opts.tracing ? wrapAISDK(ai) : ai;

    return new ToolLoopAgent({
        model: opts.model,
        instructions: opts.systemPrompt,
        tools: opts.tools,
        reasoning: opts.reasoning,
    });
};
