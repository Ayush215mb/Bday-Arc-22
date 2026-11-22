import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

export const scheduleSlackMessageTool = (slack: WebClient) =>
    tool({
        description:
            "Schedule a Slack message or reminder for later (up to 120 days ahead). Works for channels and DMs.",
        inputSchema: z.object({
            channel: z.string().describe("Channel ID, or user ID to DM"),
            text: z.string(),
            send_at: z
                .string()
                .describe(
                    "Future ISO 8601 time with offset, e.g. 2026-11-23T09:30:00+05:30",
                ),
            thread_ts: z.string().optional(),
        }),
        needsApproval: false,
        execute: async ({ channel, text, send_at, thread_ts }) => {
            const post_at = Math.floor(Date.parse(send_at) / 1000);
            if (Number.isNaN(post_at) || post_at <= Date.now() / 1000) {
                return {
                    ok: false,
                    error: "send_at must be a valid future time",
                };
            }
            const res = await slack.chat.scheduleMessage({
                channel,
                text,
                post_at,
                thread_ts,
            });
            return {
                ok: res.ok,
                scheduled_message_id: res.scheduled_message_id,
                post_at: new Date(post_at * 1000).toISOString(),
            };
        },
    });
