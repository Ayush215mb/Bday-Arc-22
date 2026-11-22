import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

export const searchSlackMessagesTool = (userSlack: WebClient) =>
    tool({
        description:
            "Search Slack message history. Supports modifiers like `from:@name`, `in:#channel`, `after:2026-11-01`. Use to answer 'what did X say about Y' or find past decisions.",
        inputSchema: z.object({
            query: z.string(),
            count: z.number().int().min(1).max(20).default(10),
        }),
        execute: async ({ query, count }) => {
            const res = await userSlack.search.messages({
                query,
                count,
                sort: "timestamp",
                sort_dir: "desc",
            });
            return (res.messages?.matches ?? []).map((m) => ({
                channel: m.channel?.name,
                channel_id: m.channel?.id,
                user: m.username,
                text: m.text,
                ts: m.ts,
                link: m.permalink,
            }));
        },
    });
