import { ToolLoopAgent } from "ai";
import { AgentOptions } from "./types/agent-options.type";

export const Agent = (opts: AgentOptions) => {
    return new ToolLoopAgent({
        model: opts.model,
        instructions: opts.systemPrompt,
        tools: opts.tools,
        reasoning: opts.reasoning,
    });
};
