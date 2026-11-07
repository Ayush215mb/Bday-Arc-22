import z from "zod";

export const DraftResponseSchema = z.object({
    destination: z
        .string()
        .min(1)
        .describe("City or place the user wants to visit"),
    days: z.number(),
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
        .min(1)
        .max(3)
        .describe("User's budget currency, ISO code"),
    localCurrency: z
        .string()
        .min(1)
        .max(3)
        .describe("Destination's currency, ISO code"),
    interests: z.array(z.string()),
});
