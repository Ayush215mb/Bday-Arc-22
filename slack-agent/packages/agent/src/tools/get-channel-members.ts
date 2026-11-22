import { tool } from "ai";
import { z } from "zod";
import type { WebClient, ConversationsMembersResponse } from "@slack/web-api";

export const getChannelMembersTool = (slack: WebClient) =>
    tool({
        description:
            "Get member user IDs of a channel. Chain with get_team_status to answer 'who in #channel is free?'.",
        inputSchema: z.object({
            channel: z.string().describe("Channel ID, e.g. C0123456789"),
        }),
        execute: async ({ channel }) => {
            const ids: string[] = [];
            for await (const page of slack.paginate("conversations.members", {
                channel,
                limit: 200,
            })) {
                ids.push(
                    ...((page as ConversationsMembersResponse).members ?? []),
                );
                if (ids.length >= 200) break;
            }
            return { count: ids.length, user_ids: ids.slice(0, 200) };
        },
    });
