import z from "zod";

export const DraftResponseSchema = z.object({
    destination: z
        .string()
        .nullable()
        .describe("City or country, null if not stated"),
    days: z.number().nullable(),
    startDate: z
        .string()
        .nullable()
        .describe("The tentative start date of the trip"),
    endDate: z
        .string()
        .nullable()
        .describe("The tentative end date of the trip"),
    budget: z.number().nullable(),
    currency: z
        .string()
        .nullable()
        .describe("User's budget currency, ISO code"),
    localCurrency: z
        .string()
        .nullable()
        .describe("Destination's currency, ISO code"),
    interests: z.array(z.string()),
});
