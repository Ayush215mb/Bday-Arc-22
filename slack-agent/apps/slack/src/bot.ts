import { Chat, type Thread } from "chat";
import { toAiMessages } from "chat/ai";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { Agent, deepseekModel } from "@slack-agent/agent";
import { createRedisState } from "@chat-adapter/state-redis";

const agent = Agent({ model: deepseekModel });

export const bot = new Chat({
    userName: "glevoidd-bot",
    adapters: { slack: createSlackAdapter({ agentView: true }) },
    state: process.env.REDIS_URL ? createRedisState() : createMemoryState(),
});

async function respond(thread: Thread) {
    try {
        console.log("respond: start");
        await thread.startTyping();
        const { messages } = await bot.history.thread.list(thread.id, {
            limit: 20,
        });
        const result = await agent.stream({
            messages: await toAiMessages(messages),
            abortSignal: thread.signal,
        });
        await thread.post(result.stream);
        console.log("respond: done");
    } catch (err) {
        console.error("respond failed:", err);
    }
}

bot.onNewMention(async (thread) => {
    await thread.subscribe();
    await respond(thread);
});

bot.onSubscribedMessage(async (thread) => {
    await respond(thread);
});
