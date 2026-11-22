import { tool } from "ai";
import { z } from "zod";
import type { WebClient } from "@slack/web-api";
import type { CalendarFor } from "../utils/google-calendar";
import { getSlackEmails } from "../utils/slack-email";

export const getCalendarEventsTool = (
    slack: WebClient,
    calendarFor: CalendarFor,
) =>
    tool({
        description:
            "List a person's Google Calendar events in a time range (what meetings they have). Private events are shown as 'Busy'.",
        inputSchema: z.object({
            user_id: z.string().describe("Slack user ID"),
            from: z.string().describe("ISO 8601 with offset"),
            to: z.string().describe("ISO 8601 with offset"),
        }),
        execute: async ({ user_id, from, to }) => {
            const [person] = await getSlackEmails(slack, [user_id]);
            if (!person?.email)
                return { ok: false, error: "No email on Slack profile" };

            const res = await calendarFor(person.email).events.list({
                calendarId: "primary",
                timeMin: new Date(from).toISOString(),
                timeMax: new Date(to).toISOString(),
                singleEvents: true,
                orderBy: "startTime",
                maxResults: 25,
            });

            return {
                person: person.name,
                events: (res.data.items ?? [])
                    .filter(
                        (e) =>
                            e.status !== "cancelled" &&
                            e.attendees?.find((a) => a.self)?.responseStatus !==
                                "declined",
                    )
                    .map((e) => ({
                        title:
                            e.visibility === "private" ||
                            e.visibility === "confidential"
                                ? "Busy (private)"
                                : (e.summary ?? "(no title)"),
                        start: e.start?.dateTime ?? e.start?.date,
                        end: e.end?.dateTime ?? e.end?.date,
                        blocksTime: e.transparency !== "transparent",
                        attendeeCount: e.attendees?.length ?? 0,
                        meetLink: e.hangoutLink ?? null,
                    })),
            };
        },
    });
