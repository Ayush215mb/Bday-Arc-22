import { tool } from "ai";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { WebClient } from "@slack/web-api";
import type { CalendarFor } from "../utils/google-calendar";
import { getSlackEmails } from "../utils/slack-email";

export const scheduleMeetingTool = (
    slack: WebClient,
    calendarFor: CalendarFor,
    defaultSubject: string,
) =>
    tool({
        description:
            "Create a Google Calendar event with a Meet link and invite people. Call find_free_slots first to pick a time everyone is free.",
        inputSchema: z.object({
            title: z.string(),
            start: z.string().describe("ISO 8601 with offset"),
            end: z.string().describe("ISO 8601 with offset"),
            user_ids: z
                .array(z.string())
                .min(1)
                .describe("Slack user IDs of attendees"),
            description: z.string().optional(),
        }),
        needsApproval: false,
        execute: async ({ title, start, end, user_ids, description }) => {
            const people = await getSlackEmails(slack, user_ids);
            const attendees = people
                .filter((p) => !!p.email)
                .map((p) => ({ email: p.email! }));

            const res = await calendarFor(defaultSubject).events.insert({
                calendarId: "primary",
                conferenceDataVersion: 1,
                sendUpdates: "all",
                requestBody: {
                    summary: title,
                    description,
                    start: { dateTime: new Date(start).toISOString() },
                    end: { dateTime: new Date(end).toISOString() },
                    attendees,
                    conferenceData: {
                        createRequest: {
                            requestId: randomUUID(),
                            conferenceSolutionKey: { type: "hangoutsMeet" },
                        },
                    },
                },
            });

            return {
                ok: true,
                eventId: res.data.id,
                link: res.data.htmlLink,
                meet: res.data.hangoutLink,
                skipped_no_email: people
                    .filter((p) => !p.email)
                    .map((p) => p.name),
            };
        },
    });
