import z from "zod";

export const ItineraryItemSchema = z.object({
    timeSlot: z.enum(["morning", "afternoon", "evening"]),
    title: z.string(),
    area: z.string(),
    description: z
        .string()
        .describe("1-2 sentences: what to do and why it fits their interests"),
    estCostLocal: z
        .number()
        .nullable()
        .describe("copied from research; null if unknown"),
    durationMinutes: z.number().nullable(),
    isEstimate: z.boolean(),
});

export const ItinerarySchema = z.object({
    title: z.string(),
    summary: z.string(),
    stay: z.object({
        name: z.string(),
        area: z.string(),
        pricePerNightLocal: z.number().nullable(),
        reason: z.string(),
    }),
    days: z.array(
        z.object({
            day: z.number(),
            theme: z.string(),
            items: z.array(ItineraryItemSchema),
        }),
    ),
    tips: z.array(z.string()),
    warnings: z.array(z.string()),
    assumptions: z.array(z.string()),
});

export type Itinerary = z.infer<typeof ItinerarySchema>;
