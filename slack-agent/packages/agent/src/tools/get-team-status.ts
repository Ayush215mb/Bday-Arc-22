import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

export const getTeamStatusTool = (slack: WebClient) =>
    tool({
        description:
            "Check what people are doing right now: online/away, custom status (e.g. 'In a meeting', 'On leave'), Do Not Disturb, and local time. Use for 'who is free?'. Get IDs from find_slack_user or get_channel_members first.",
        inputSchema: z.object({
            user_ids: z.array(z.string()).min(1).max(20),
        }),
        execute: async ({ user_ids }) =>
            Promise.all(
                user_ids.map(async (id) => {
                    try {
                        const [info, presence, dnd] = await Promise.all([
                            slack.users.info({ user: id }),
                            slack.users.getPresence({ user: id }),
                            slack.dnd.info({ user: id }),
                        ]);
                        const u = info.user;
                        const p = u?.profile;
                        const now = Date.now() / 1000;
                        const expiry = p?.status_expiration;

                        const inDnd =
                            !!dnd.snooze_enabled ||
                            (!!dnd.dnd_enabled &&
                                now >= (dnd.next_dnd_start_ts ?? Infinity) &&
                                now <= (dnd.next_dnd_end_ts ?? 0));

                        return {
                            id,
                            name: u?.real_name ?? u?.name ?? id,
                            title: p?.title || null,
                            presence: presence.presence, // "active" | "away"
                            status:
                                [p?.status_emoji, p?.status_text]
                                    .filter(Boolean)
                                    .join(" ") || null,
                            statusExpiresAt: expiry
                                ? new Date(expiry * 1000).toISOString()
                                : null,
                            doNotDisturb: inDnd,
                            localTime: u?.tz
                                ? new Date().toLocaleTimeString("en-GB", {
                                      timeZone: u.tz,
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : null,
                            timezone: u?.tz ?? null,
                        };
                    } catch {
                        return { id, error: "Could not fetch status" };
                    }
                }),
            ),
    });
