import { google, type calendar_v3 } from "googleapis";

export type CalendarFor = (email: string) => calendar_v3.Calendar;

// Service account with domain-wide delegation: impersonates the given user
export const createCalendarFor = (): CalendarFor => (email) =>
    google.calendar({
        version: "v3",
        auth: new google.auth.JWT({
            email: process.env.GOOGLE_SA_EMAIL,
            key: process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/calendar"],
            subject: email,
        }),
    });
