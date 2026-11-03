import { z } from "zod";

export const ResearchSchema = z.object({
    destination: z.string(),
    weather: z.object({
        summary: z.string(),
        isTypicalForMonth: z.boolean().describe("true if dates were tentative"),
        warnings: z
            .array(z.string())
            .describe("typhoons, monsoon, disasters, closures"),
    }),
    budget: z.object({
        originalAmount: z.number(),
        originalCurrency: z.string(),
        localAmount: z.number(),
        localCurrency: z.string(),
        perDayLocal: z.number(),
        breakdownLocal: z.object({
            stay: z.number(),
            food: z.number(),
            transport: z.number(),
            activities: z.number(),
            buffer: z.number(),
        }),
    }),
    hotels: z.array(
        z.object({
            name: z.string(),
            area: z.string(),
            pricePerNightLocal: z.number().nullable(),
            whyItFits: z.string(),
            isEstimate: z.boolean(),
        }),
    ),
    places: z.array(
        z.object({
            name: z.string(),
            interestMatched: z.string(),
            area: z.string(),
            description: z.string(),
            suggestedVisitMinutes: z.number().nullable(),
            estCostLocal: z.number().nullable(),
            bestTimeOfDay: z.enum(["morning", "afternoon", "evening", "any"]),
        }),
    ),
    flights: z
        .object({
            estRoundTripLocal: z.number().nullable(),
            notes: z.string(),
        })
        .nullable(),
    missingInfo: z
        .array(z.string())
        .describe("essential details the user must still provide"),
});

export type Research = z.infer<typeof ResearchSchema>;
