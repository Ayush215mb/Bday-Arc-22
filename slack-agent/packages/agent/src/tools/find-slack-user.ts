import { tool } from "ai";
import { z } from "zod";
import type { WebClient, UsersListResponse } from "@slack/web-api";

export const findSlackUserTool = (slack: WebClient) =>
    tool({
        description:
            "Find a Slack user's ID by name. Call this before mentioning anyone. Never guess IDs.",
        inputSchema: z.object({
            name: z.string().describe("Name or handle to search"),
        }),
        execute: async ({ name }) => {
            const q = name.toLowerCase();
            const matches: { id: string; name: string }[] = [];

            for await (const page of slack.paginate("users.list", {
                limit: 200,
            })) {
                const { members = [] } = page as UsersListResponse;
                for (const m of members) {
                    if (m.deleted || m.is_bot || !m.id) continue;
                    const names = [m.name, m.real_name, m.profile?.display_name]
                        .filter((s): s is string => !!s)
                        .map((s) => s.toLowerCase());
                    if (names.some((n) => n.includes(q))) {
                        matches.push({
                            id: m.id,
                            name: m.real_name ?? m.name ?? m.id,
                        });
                    }
                }
            }
            return matches.slice(0, 5);
        },
    });
