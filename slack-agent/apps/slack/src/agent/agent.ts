import { Chat, type Thread } from "chat";
import { toAiMessages } from "chat/ai";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { Agent } from "@slack-agent/agent";
import { createRedisState } from "@chat-adapter/state-redis";
import { tools } from "./tools.js";
import { deepseekModel } from "./model.js";

const agent = Agent({
    model: deepseekModel,
    systemPrompt: `You are a slack agent created to help the team`,
    tools: tools,
    reasoning: "medium",
    tracing: true,
});

// glevoidd is the name of the workspace
export const glevoidd = new Chat({
    userName: "glevoidd",
    adapters: {
        slack: createSlackAdapter({ agentView: true, sessionTitle: false }),
    },
    state: process.env.REDIS_URL ? createRedisState() : createMemoryState(),
});

async function respond(thread: Thread) {
    try {
        await thread.startTyping();
        const { messages } = await glevoidd.history.thread.list(thread.id, {
            limit: 20,
        });
        const result = await agent.stream({
            messages: await toAiMessages(messages),
            abortSignal: thread.signal,
        });
        await thread.post(result.stream);
    } catch (err) {
        console.error("respond failed:", err);
    }
}

glevoidd.onNewMention(async (thread) => {
    await thread.subscribe();
    await respond(thread);
});

glevoidd.onSubscribedMessage(async (thread) => {
    await respond(thread);
});
