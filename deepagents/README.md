# what are deep agents?

Deep agents are a standalone library built on top of LangGraph that brings production-grade capabilities to LLM agents. Unlike simple agents that just loop between “think, act, observe,” deep agents come with built-in infrastructure for handling real-world complexity.

Here is what makes them different from a basic ReAct agent:

**Planning** -- Deep agents automatically break down complex tasks into subtasks using a built-in write_todos tool. Before diving into execution, they create a plan of attack.

**File System for Context Management** -- LLMs have limited context windows. Deep agents solve this by offloading large intermediate results (like search results or document content) into a virtual file system using write_file and read_file tools. This means they can handle tasks that produce far more data than a context window could hold.

**Subagent Spawning** -- For complex tasks, a deep agent can delegate subtasks to specialized subagents. Each subagent operates in its own context isolation, preventing the “context pollution” problem where unrelated information from one subtask confuses another.

**Persistent Memory** -- Deep agents can persist memory across conversations and threads, making them suitable for long-running tasks and multi-session workflows.

# Deep Agents vs Basic Agents: When to Use What

Use a basic agent when:

- The task is straightforward (single question, single tool call)

- Context requirements are small (fits in one context window)

- Latency matters more than thoroughness

- You need a quick prototype

Use a deep agent when:

- The task requires multiple steps and planning

- You are processing large amounts of information

- Quality and thoroughness matter more than speed

- You need the agent to produce structured artifacts (reports, files)

- Different subtasks benefit from context isolation
