import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

export const inviteToChannelTool = (slack: WebClient) =>
    tool({
        description:
            "Invite users to a channel. The bot must already be in the channel.",
        inputSchema: z.object({
            channel: z.string().describe("Channel ID"),
            user_ids: z.array(z.string()).min(1).max(100),
        }),
        needsApproval: false,
        execute: async ({ channel, user_ids }) => {
            const res = await slack.conversations.invite({
                channel,
                users: user_ids.join(","),
            });
            return { ok: res.ok, channel: res.channel?.id };
        },
    });
