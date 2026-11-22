import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

const MAX_CHARS = 30_000;
const MENTION = /<@([UW][A-Z0-9]+)>/g;

export const getConversationTranscriptTool = (slack: WebClient) =>
    tool({
        description:
            "Fetch messages from a channel, DM, or one thread as a readable transcript (oldest first). Use it as source material for meeting minutes, summaries, or 'what did I miss'. Pass thread_ts for a single thread, otherwise a time range. The bot must be a member of the channel.",
        inputSchema: z.object({
            channel: z.string().describe("Channel ID"),
            thread_ts: z.string().optional().describe("Parent message ts"),
            since: z
                .string()
                .optional()
                .describe("ISO 8601, e.g. 2026-11-22T09:00:00+05:30"),
            until: z.string().optional().describe("ISO 8601"),
            limit: z.number().int().min(1).max(500).default(200),
            timezone: z
                .string()
                .default("UTC")
                .describe("IANA tz for timestamps, e.g. Asia/Kolkata"),
        }),
        execute: async ({
            channel,
            thread_ts,
            since,
            until,
            limit,
            timezone,
        }) => {
            const oldest = since ? String(Date.parse(since) / 1000) : undefined;
            const latest = until ? String(Date.parse(until) / 1000) : undefined;

            const res = thread_ts
                ? await slack.conversations.replies({
                      channel,
                      ts: thread_ts,
                      oldest,
                      latest,
                      limit,
                  })
                : await slack.conversations.history({
                      channel,
                      oldest,
                      latest,
                      limit,
                  });

            const raw = res.messages ?? [];
            // history is newest-first, replies is oldest-first
            const msgs = (thread_ts ? raw : [...raw].reverse()).filter(
                (m) =>
                    m.text &&
                    m.subtype !== "channel_join" &&
                    m.subtype !== "channel_leave",
            );

            // resolve authors + mentions to names in one pass
            const ids = new Set<string>();
            for (const m of msgs) {
                if (m.user) ids.add(m.user);
                for (const x of (m.text ?? "").matchAll(MENTION)) ids.add(x[1]);
            }
            const names = new Map<string, string>();
            await Promise.all(
                [...ids].map(async (id) => {
                    const r = await slack.users
                        .info({ user: id })
                        .catch(() => null);
                    names.set(id, r?.user?.real_name ?? r?.user?.name ?? id);
                }),
            );

            const lines = msgs.map((m) => {
                const when = new Date(Number(m.ts) * 1000).toLocaleString(
                    "en-GB",
                    {
                        timeZone: timezone,
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    },
                );
                const who = m.user
                    ? (names.get(m.user) ?? m.user)
                    : (m.username ?? "bot");
                const text = (m.text ?? "").replace(
                    MENTION,
                    (_, id) => `@${names.get(id) ?? id}`,
                );
                return `[${when}] ${who}: ${text}`;
            });

            const transcript = lines.join("\n");
            const authors = new Set(
                msgs.map((m) => m.user).filter((u): u is string => !!u),
            );

            return {
                messageCount: msgs.length,
                timezone,
                participants: [...authors].map((id) => ({
                    id,
                    name: names.get(id) ?? id,
                })),
                truncated: transcript.length > MAX_CHARS,
                transcript: transcript.slice(0, MAX_CHARS),
            };
        },
    });
