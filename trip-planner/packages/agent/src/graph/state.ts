import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { z } from "zod";

export const TripRequest = z.object({
    destination: z
        .string()
        .nullable()
        .describe("City or country, null if not stated"),
    days: z.number().nullable(),
    startDate: z.string().nullable().describe("The start of the trip"),
    endDate: z.string().nullable().describe("The end of the trip"),
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

export const State = Annotation.Root({
    ...MessagesAnnotation.spec,
    userInput: Annotation<string>(),
    request: Annotation<z.infer<typeof TripRequest> | null>(),
    currency: Annotation<unknown | null>(),
    weather: Annotation<unknown | null>(),
    places: Annotation<unknown | null>(),
    itinerary: Annotation<z.infer<typeof ItinerarySchema> | null>(),
    question: Annotation<string | null>(),
});
export type S = typeof State.State;
