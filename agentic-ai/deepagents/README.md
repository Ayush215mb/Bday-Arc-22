# what are deep agents?

DeepAgents is an open-source agent harness built on top of Langchain and LangGraph. It is designed to handle complex, open-ended tasks over long time horizons and is particularly useful for building agents and applications that are powered by large language models (LLMs). Here are some key features and capabilities of DeepAgents:

## Key Features and Capabilities:

1. **Execution Environment**:
    - Tools
    - Virtual Filesystem
    - Optional Sandbox
    - REPL (Read-Eval-Print Loop)

2. **Context Management**:
    - Skills
    - Memory
    - Summarization
    - Context Offloading
    - Prompt Caching

3. **Delegation**:
    - Subagent Spawning
    - Optional Task Planning

4. **Steering**:
    - Human-in-the-loop Approval
    - Interrupts

## **Components**:

- **Planning Tools**: These help agents break down complex tasks and track progress.

- **Access to Filesystem**: Agents can access and manipulate the file system, which is useful for managing context and storing long-term memory.

- **Subagent Delegation**: Agents can spawn subagents to handle specific tasks, allowing for parallel processing and task decomposition.

- **Human-in-the-loop Support**: This feature allows for human oversight and intervention, which can be crucial for complex tasks.

## Use Cases:

- **Complex, Multi-Step Tasks**: DeepAgents is particularly useful for tasks that require long-term planning and execution, such as research, coding, and multi-step workflows.
- **Customizability**: While DeepAgents provides a lot of built-in functionality, it is also highly customizable, allowing developers to add their own tools, skills, and instructions.

## Deep Agents vs Basic Agents: When to Use What

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
