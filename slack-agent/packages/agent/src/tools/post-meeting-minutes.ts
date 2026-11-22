import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";

const isSlackId = (s: string) => /^[UW][A-Z0-9]{8,}$/.test(s);
const who = (s: string) => (isSlackId(s) ? `<@${s}>` : s);
const bullets = (items: string[]) =>
    items.length ? items.map((i) => `• ${i}`).join("\n") : "_None_";

export const postMeetingMinutesTool = (slack: WebClient) =>
    tool({
        description:
            "Post structured meeting minutes (MOM) to a channel, thread, or DM. First get the transcript with get_conversation_transcript, then fill every field from it. Use Slack user IDs for owners/attendees where known (rendered as mentions).",
        inputSchema: z.object({
            channel: z.string().describe("Channel ID, or user ID to DM"),
            thread_ts: z.string().optional(),
            title: z.string(),
            date: z.string().describe("e.g. 22 Nov 2026"),
            attendees: z.array(z.string()).describe("Slack user IDs or names"),
            summary: z.string().describe("2-3 sentence overview"),
            discussion: z.array(z.string()).describe("Key discussion points"),
            decisions: z.array(z.string()),
            action_items: z.array(
                z.object({
                    owner: z.string().describe("Slack user ID or name"),
                    task: z.string(),
                    due: z.string().optional(),
                }),
            ),
        }),
        needsApproval: false,
        execute: async ({
            channel,
            thread_ts,
            title,
            date,
            attendees,
            summary,
            discussion,
            decisions,
            action_items,
        }) => {
            const actions = action_items.length
                ? action_items
                      .map(
                          (a) =>
                              `☐ ${who(a.owner)} — ${a.task}${a.due ? ` _(due ${a.due})_` : ""}`,
                      )
                      .join("\n")
                : "_None_";

            const text = [
                `*📝 ${title}*`,
                `*Date:* ${date}\n*Attendees:* ${attendees.map(who).join(", ")}`,
                `*Summary*\n${summary}`,
                `*Discussion*\n${bullets(discussion)}`,
                `*Decisions*\n${bullets(decisions)}`,
                `*Action items*\n${actions}`,
            ].join("\n\n");

            const res = await slack.chat.postMessage({
                channel,
                thread_ts,
                text,
                mrkdwn: true,
            });
            return { ok: res.ok, ts: res.ts, channel: res.channel };
        },
    });
