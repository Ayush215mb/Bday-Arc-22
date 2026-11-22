import { tool } from "ai";
import { z } from "zod";
import type { WebClient, ConversationsListResponse } from "@slack/web-api";

export const listChannelsTool = (slack: WebClient) =>
    tool({
        description:
            "List or search channels by name/purpose. Returns channel IDs. Private channels only appear if the bot is a member.",
        inputSchema: z.object({
            query: z.string().optional().describe("Filter by name or purpose"),
        }),
        execute: async ({ query }) => {
            const q = query?.toLowerCase();
            const out: {
                id: string;
                name: string;
                topic?: string;
                members?: number;
                isMember?: boolean;
                isPrivate?: boolean;
            }[] = [];

            for await (const page of slack.paginate("conversations.list", {
                types: "public_channel,private_channel",
                exclude_archived: true,
                limit: 200,
            })) {
                const { channels = [] } = page as ConversationsListResponse;
                for (const c of channels) {
                    if (!c.id || !c.name) continue;
                    if (
                        q &&
                        !c.name.toLowerCase().includes(q) &&
                        !c.purpose?.value?.toLowerCase().includes(q)
                    )
                        continue;
                    out.push({
                        id: c.id,
                        name: c.name,
                        topic: c.topic?.value || undefined,
                        members: c.num_members,
                        isMember: c.is_member,
                        isPrivate: c.is_private,
                    });
                }
            }
            return out.slice(0, 20);
        },
    });
