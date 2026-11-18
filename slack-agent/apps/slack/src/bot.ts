import { Chat, type Thread } from "chat";
import { toAiMessages } from "chat/ai";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { Agent, deepseekModel } from "@slack-agent/agent";
import { createRedisState } from "@chat-adapter/state-redis";

const agent = Agent({ model: deepseekModel });

export const bot = new Chat({
    userName: "glevoidd",
    adapters: { slack: createSlackAdapter({ agentView: true }) },
    state: process.env.REDIS_URL ? createRedisState() : createMemoryState(),
});

console.log(JSON.stringify(bot, null, 2));

async function respond(thread: Thread) {
    try {
        console.log("respond: start");
        console.log(thread);
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
    console.log(thread);
    await thread.subscribe();
    console.log(thread);
    await respond(thread);
});

bot.onSubscribedMessage(async (thread) => {
    await respond(thread);
});
