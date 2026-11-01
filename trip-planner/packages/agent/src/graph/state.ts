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

export type TripRequestT = z.infer<typeof TripRequest>;
export type ItineraryT = z.infer<typeof ItinerarySchema>;

export type BudgetCheck = {
    total: number;
    limit: number;
    currency: string;
    withinBudget: boolean;
    overBy: number;
};

const replace = <T>(defaultValue: T) => ({
    reducer: (_prev: T, next: T) => next,
    default: () => defaultValue,
});

export const State = Annotation.Root({
    ...MessagesAnnotation.spec,
    /** Preferred free-text input. Also derived from messages / message. */
    userInput: Annotation<string, string>(replace("")),
    /** Studio-friendly alias: `{ "message": "..." }` */
    message: Annotation<string | undefined, string | undefined>(
        replace(undefined),
    ),
    request: Annotation<TripRequestT | null, TripRequestT | null>(
        replace(null),
    ),
    currency: Annotation<unknown | null, unknown | null>(replace(null)),
    weather: Annotation<unknown | null, unknown | null>(replace(null)),
    places: Annotation<unknown | null, unknown | null>(replace(null)),
    itinerary: Annotation<ItineraryT | null, ItineraryT | null>(replace(null)),
    question: Annotation<string | null, string | null>(replace(null)),
    budgetLimitLocal: Annotation<number | null, number | null>(replace(null)),
    budgetCheck: Annotation<BudgetCheck | null, BudgetCheck | null>(
        replace(null),
    ),
    refineCount: Annotation<number, number>(replace(0)),
    refineFeedback: Annotation<string | null, string | null>(replace(null)),
});

export type S = typeof State.State;

export const MAX_SEARCHES = 2;
export const MAX_REFINES = 2;
