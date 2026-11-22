import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

export const sendDirectMessageTool = (slack: WebClient) =>
    tool({
        description:
            "Send a direct message (DM) to a Slack user. Resolve the user ID with find_slack_user first. Never guess IDs.",
        inputSchema: z.object({
            user_id: z.string().describe("Slack user ID, e.g. U0123456789"),
            text: z.string().describe("Message body (Slack mrkdwn supported)"),
        }),
        needsApproval: false,
        execute: async ({ user_id, text }) => {
            const dm = await slack.conversations.open({ users: user_id });
            const channel = dm.channel?.id;
            if (!channel) return { ok: false, error: "Could not open DM" };

            const res = await slack.chat.postMessage({ channel, text });
            return { ok: res.ok, ts: res.ts, channel };
        },
    });
