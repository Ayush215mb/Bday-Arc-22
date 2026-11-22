import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

export const postSlackMessageTool = (slack: WebClient) =>
    tool({
        description:
            "Post a message to a Slack channel. Mention people as <@USER_ID>.",
        inputSchema: z.object({
            channel: z.string().describe("Channel ID, e.g. C0123456789"),
            text: z.string(),
            thread_ts: z.string().optional(),
            USER_ID: z.string().optional().describe("User ID"),
        }),
        needsApproval: false,
        execute: async ({ channel, text, thread_ts }) => {
            const res = await slack.chat.postMessage({
                channel,
                text,
                thread_ts,
            });
            if (!res.ok) return `Slack API error`;
            return { ok: res.ok, ts: res.ts, channel: res.channel };
        },
    });
