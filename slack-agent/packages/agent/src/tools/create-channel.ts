import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

export const createChannelTool = (slack: WebClient) =>
    tool({
        description:
            "Create a new Slack channel, optionally set a topic and invite people. Check list_channels first to avoid duplicates.",
        inputSchema: z.object({
            name: z
                .string()
                .regex(/^[a-z0-9][a-z0-9_-]{0,79}$/)
                .describe("Lowercase, no spaces, e.g. proj-atlas"),
            is_private: z.boolean().default(false),
            topic: z.string().optional(),
            user_ids: z
                .array(z.string())
                .max(100)
                .optional()
                .describe("People to invite"),
        }),
        needsApproval: false,
        execute: async ({ name, is_private, topic, user_ids }) => {
            const res = await slack.conversations.create({ name, is_private });
            const id = res.channel?.id;
            if (!id) return { ok: false, error: "Channel not created" };

            if (topic)
                await slack.conversations.setTopic({ channel: id, topic });
            if (user_ids?.length) {
                await slack.conversations.invite({
                    channel: id,
                    users: user_ids.join(","),
                });
            }
            return { ok: true, channel: id, name: res.channel?.name };
        },
    });
