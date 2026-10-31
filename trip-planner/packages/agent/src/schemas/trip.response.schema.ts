import z from "zod";

export const ItinerarySchema = z.object({
    destination: z.string(),
    summary: z.string(),
    totalEstimatedCost: z.object({ amount: z.number(), currency: z.string() }),
    weatherNote: z.string().nullable(),
    days: z.array(
        z.object({
            day: z.number(),
            title: z.string(),
            activities: z.array(
                z.object({
                    time: z.string(),
                    name: z.string(),
                    description: z.string(),
                    estimatedCost: z.number().nullable(),
                }),
            ),
        }),
    ),
});
