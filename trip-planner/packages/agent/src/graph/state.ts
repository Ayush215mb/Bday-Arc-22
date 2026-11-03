import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { z } from "zod";
import { ItinerarySchema } from "../schemas/itinerary.response.schema";
import { DraftResponseSchema } from "../schemas/draft.response.schema";
import { ResearchSchema } from "../schemas/research.response.schema";

export type DraftResponseT = z.infer<typeof DraftResponseSchema>;
export type ItineraryT = z.infer<typeof ItinerarySchema>;
export type Research = z.infer<typeof ResearchSchema>;
export type BudgetCheck = {
    total: number;
    limit: number;
    currency: string;
    withinBudget: boolean;
    overBy: number;
};

export const State = Annotation.Root({
    ...MessagesAnnotation.spec,
    userInput: Annotation<string | null>,
    message: Annotation<string | null>,
    request: Annotation<DraftResponseT | null>,
    currency: Annotation<string | null>,
    weather: Annotation<string | null>,
    places: Annotation<Array<string> | null>,
    itinerary: Annotation<ItineraryT | null>,
    question: Annotation<string | null>,
    budgetLimitLocal: Annotation<number>,
    budgetCheck: Annotation<BudgetCheck>,
    refineCount: Annotation<number>,
    refineFeedback: Annotation<string>,
    research: Annotation<Research | null>(),
    response: Annotation<string>(),
    askCount: Annotation<number>({
        reducer: (_, next) => next,
        default: () => 0,
    }),
});

export type S = typeof State.State;

export const MAX_SEARCHES = 2;
export const MAX_REFINES = 2;
