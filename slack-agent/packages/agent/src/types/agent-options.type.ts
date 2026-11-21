import type { LanguageModel, ToolSet } from "ai";

export interface AgentOptions {
    model: LanguageModel;
    apikey?: string;
    reasoning?:
        | "provider-default"
        | "none"
        | "minimal"
        | "low"
        | "medium"
        | "high"
        | "xhigh"
        | "max";
    BaseUrl?: string;
    systemPrompt?: string;
    tools?: ToolSet;
    tracing: boolean;
}
