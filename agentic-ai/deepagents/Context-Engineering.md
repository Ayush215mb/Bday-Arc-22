# Context engineering in Deep Agents

[Context engineering](https://docs.langchain.com/oss/javascript/deepagents/context-engineering) is providing the right information and tools in the right format so your deep agent can accomplish tasks reliably.

## Types of context

| Context Type            | What You Control                                                                  | Scope                             |
| ----------------------- | --------------------------------------------------------------------------------- | --------------------------------- |
| **Input context**       | What goes into the agent's prompt at startup (system prompt, memory, skills)      | Static, applied each run          |
| **Runtime context**     | Static configuration passed at invoke time (user metadata, API keys, connections) | Per run, propagates to subagents  |
| **Context compression** | Built-in offloading and summarization to keep context within window limits        | Automatic, when limits approached |
| **Context isolation**   | Use subagents to quarantine heavy work, returning only results to the main agent  | Per subagent, when delegated      |
| **Long-term memory**    | Persistent storage across threads using the virtual filesystem                    | Persistent across conversations   |

## Input context

Input context is information provided to your deep agent at startup that becomes part of its system prompt. The final prompt consists of several sources:

- System Prompt: Custom instructions you provide plus built-in agent guidance.

- Memory: Persistent [AGENTS.md](https://agents.md/) files always loaded when configured.

- [Skills](https://docs.langchain.com/oss/javascript/deepagents/skills#usage): The agent reads frontmatter from each SKILL.md at startup, then loads full skill content only when it determines the skill is relevant.

- Tool prompts: Instructions for using built-in tools or custom tools.

## Runtime context

- Runtime context is per-run configuration you pass when you invoke the agent.

- It is not automatically included in the model prompt; the model only sees it if a tool, middleware, or other logic reads it and adds it to messages or the system prompt.

- Use runtime context for user metadata (IDs, preferences, roles), API keys, database connections, feature flags, or other values your tools and harness need.

CODE:

```
const result = await agent.invoke(
    { messages: [{ role: "user", content: "Get my recent activity" }] },
    { context: { userId: "user-123", apiKey: "sk-..." } },
);
```

## Context compression

- Every create_deep_agent call includes built-in context compression. You do not need to add middleware for offloading or summarization to work.

- Long-running tasks produce large tool outputs and long conversation history. Context compression reduces the size of information in an agent’s working memory while preserving details relevant to the task.

- To shrink the tool schemas sent on every turn before compression ever runs, exclude unused built-in tools via a [harness profile](https://docs.langchain.com/oss/javascript/deepagents/profiles#harness-profiles) (excluded_tools). See [Tool prompts](https://docs.langchain.com/oss/javascript/deepagents/context-engineering#tool-prompts).

Built-in mechanisms to ensure the context passed to LLMs stays within its context window limit:

- Offloading: Deep Agents use the built-in filesystem tools to automatically offload content and to search and retrieve that offloaded content as needed. Content offloading happens when tool call inputs or results exceed a token threshold (default 20,000)

- Summarization: Every create_deep_agent call includes SummarizationMiddleware in the bare stack. When the context size crosses the model’s context window limit (for example 85% of max_input_tokens), and there is no more context eligible for offloading, the deep agent summarizes the message history automatically.

## Context isolation with subagents

[Subagents](https://docs.langchain.com/oss/javascript/deepagents/subagents) solve the context bloat problem. When the main agent uses tools with large outputs (web search, file reads, database queries), the context window fills quickly. Subagents isolate this work—the main agent receives only the final result, not the dozens of tool calls that produced it. You can also configure each subagent separately from the main agent (for example, model, tools, system prompt, and skills).

How it works:

- Main agent has a task tool to delegate work
- Subagent runs with its own fresh context
- Subagent executes autonomously until completion
- Subagent returns a single final report to the main agent
- Main agent’s context stays clean

## Long-term memory

- When using the default filesystem, your deep agent stores its working memory files in agent state, which only persists within a single thread.

- Long-term memory enables your deep agent to persist information across different threads and conversations. Deep agents can use long-term memory for storing user preferences, accumulated knowledge, research progress, or any information that should persist beyond a single session.

CODE:

```
import {
CompositeBackend,
createDeepAgent,
StateBackend,
StoreBackend,
} from "deepagents";
import { InMemoryStore } from "@langchain/langgraph";

const agent = await createDeepAgent({
    model: "ollama:north-mini-code-1.0",
    store: new InMemoryStore(),
    backend: new CompositeBackend(new StateBackend(), {
        "/memories/": new StoreBackend({
        namespace: () => ["memories"],
        }),
    }),
    systemPrompt: `When users tell you their preferences, save them to /memories/user_preferences.txt so you remember them in future conversations.`,
});
```
