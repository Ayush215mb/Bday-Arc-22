import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";
import type { CalendarFor } from "../utils/google-calendar";
import { getSlackEmails } from "../utils/slack-email";

export const findFreeSlotsTool = (
    slack: WebClient,
    calendarFor: CalendarFor,
    defaultSubject: string,
) =>
    tool({
        description:
            "Find time slots when ALL given people are free (Google Calendar free/busy). Pass only the window to search, e.g. tomorrow 10:00-18:00 in the user's timezone, not the whole day.",
        inputSchema: z.object({
            user_ids: z.array(z.string()).min(1).max(20),
            from: z.string().describe("ISO 8601 with offset"),
            to: z.string().describe("ISO 8601 with offset"),
            duration_minutes: z.number().int().min(5).max(480).default(30),
        }),
        execute: async ({ user_ids, from, to, duration_minutes }) => {
            const people = await getSlackEmails(slack, user_ids);
            const withEmail = people.filter((p) => !!p.email);
            const missing = people.filter((p) => !p.email).map((p) => p.name);

            const start = Date.parse(from);
            const end = Date.parse(to);

            const res = await calendarFor(defaultSubject).freebusy.query({
                requestBody: {
                    timeMin: new Date(start).toISOString(),
                    timeMax: new Date(end).toISOString(),
                    items: withEmail.map((p) => ({ id: p.email! })),
                },
            });
            const calendars = res.data.calendars ?? {};

            const busyByPerson = withEmail.map((p) => {
                const c = calendars[p.email!];
                return {
                    name: p.name,
                    busy: (c?.busy ?? []).map((b) => ({
                        start: b.start!,
                        end: b.end!,
                    })),
                    error: c?.errors?.length
                        ? "calendar not visible"
                        : undefined,
                };
            });

            // merge everyone's busy blocks, then take the gaps
            const blocks = busyByPerson
                .flatMap((p) => p.busy)
                .map(
                    (b) =>
                        [Date.parse(b.start), Date.parse(b.end)] as [
                            number,
                            number,
                        ],
                )
                .sort((a, b) => a[0] - b[0]);

            const merged: [number, number][] = [];
            for (const [s, e] of blocks) {
                const last = merged.at(-1);
                if (last && s <= last[1]) last[1] = Math.max(last[1], e);
                else merged.push([s, e]);
            }

            const need = duration_minutes * 60_000;
            const free: { start: string; end: string }[] = [];
            let cursor = start;
            for (const [s, e] of merged) {
                if (s - cursor >= need) {
                    free.push({
                        start: new Date(cursor).toISOString(),
                        end: new Date(s).toISOString(),
                    });
                }
                cursor = Math.max(cursor, e);
            }
            if (end - cursor >= need) {
                free.push({
                    start: new Date(cursor).toISOString(),
                    end: new Date(end).toISOString(),
                });
            }

            return {
                missing_emails: missing,
                busy: busyByPerson,
                common_free_slots: free.slice(0, 10),
            };
        },
    });
