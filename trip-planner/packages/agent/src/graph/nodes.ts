import { TavilySearch } from "@langchain/tavily";
import {
    SystemMessage,
    HumanMessage,
    AIMessage,
    ToolMessage,
} from "@langchain/core/messages";
import { interrupt } from "@langchain/langgraph";
import {
    TripRequest,
    ItinerarySchema,
    MAX_SEARCHES,
    type S,
    type TripRequestT,
    type ItineraryT,
    type BudgetCheck,
} from "./state";
import { currencyConversionTool } from "../tools/currency-conversion.tool";
import { calculatorTool } from "../tools/calculator.tool";
import { placeSearchTool } from "../tools/place-search.tool";
import { weatherInfoTool } from "../tools/weather-info.tool";
import { loadModel } from "../models/model-loader";
import { existingModels } from "../models/existingModels";
import { EXTRACT_PROMPT } from "../prompts/extract.prompt";
import { DRAFT_PROMPT } from "../prompts/draft.prompt";
import { mapInterestsToGeoapify, interestsNeedLiveSearch } from "./categories";

const fast = loadModel({ model: existingModels.qwen, thinking: false });
const planner = loadModel({ model: existingModels.gemma, thinking: true });

export const tavily = new TavilySearch({ maxResults: 3 });
const plannerWithTools = planner.bindTools([tavily]);

const safe = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
        return await fn();
    } catch (e) {
        console.error(e);
        return null;
    }
};

function missingFields(request: TripRequestT | null): string[] {
    if (!request) return ["destination", "number of days"];
    return [
        !request.destination && "destination",
        !request.days && "number of days",
    ].filter(Boolean) as string[];
}

function messageText(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part && typeof part === "object" && "text" in part) {
                    return String((part as { text: unknown }).text ?? "");
                }
                return "";
            })
            .join("");
    }
    return "";
}

/** Studio sends `messages`; some clients send `message` or `userInput`. */
export function resolveUserInput(state: S): string {
    if (state.userInput?.trim()) return state.userInput.trim();
    if (typeof state.message === "string" && state.message.trim()) {
        return state.message.trim();
    }

    for (let i = state.messages.length - 1; i >= 0; i--) {
        const m = state.messages[i];
        const role =
            typeof (m as { getType?: () => string }).getType === "function"
                ? (m as { getType: () => string }).getType()
                : String(
                      (m as { type?: string; role?: string }).type ??
                          (m as { role?: string }).role ??
                          "",
                  );
        if (role === "human" || role === "user") {
            const text = messageText(m.content).trim();
            if (text) return text;
        }
    }
    return "";
}

async function extractTripRequest(userInput: string): Promise<TripRequestT> {
    if (!userInput.trim()) {
        return {
            destination: null,
            days: null,
            startDate: null,
            endDate: null,
            budget: null,
            currency: null,
            localCurrency: null,
            interests: [],
        };
    }
    return fast
        .withStructuredOutput(TripRequest)
        .invoke([
            new SystemMessage(EXTRACT_PROMPT),
            new HumanMessage(userInput),
        ]);
}

function parseJson<T>(raw: unknown): T | null {
    if (raw == null) return null;
    if (typeof raw === "object") return raw as T;
    if (typeof raw !== "string") return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function hasPlaces(places: unknown): boolean {
    if (!places) return false;
    const parsed = parseJson<{ places?: unknown[] }>(places);
    if (parsed?.places) return parsed.places.length > 0;
    return (
        typeof places === "string" &&
        places.length > 0 &&
        !places.startsWith("Error")
    );
}

function activityCosts(itinerary: ItineraryT): number[] {
    return itinerary.days.flatMap((d) =>
        d.activities.map((a) => a.estimatedCost ?? 0),
    );
}

// 1. extract
export async function extractNode(state: S) {
    const userInput = resolveUserInput(state);
    const request = await extractTripRequest(userInput);
    return { userInput, request };
}

// 2. clarify (HITL via interrupt)
export async function clarifyNode(state: S) {
    let userInput = resolveUserInput(state);
    let request = state.request;

    for (;;) {
        const missing = missingFields(request);
        if (!missing.length) {
            return { userInput, request, question: null };
        }

        const question = `Could you tell me your ${missing.join(" and ")}?`;
        const answer = interrupt({ type: "clarify", question });
        userInput = `${userInput}\n${String(answer)}`;
        request = await extractTripRequest(userInput);
    }
}

// 3. gather — parallel conditional tool calls
export async function gatherNode(state: S) {
    const request = state.request!;
    const {
        destination,
        budget,
        currency,
        localCurrency,
        startDate,
        endDate,
        interests,
    } = request;

    const currencyTask = async () => {
        if (
            budget != null &&
            currency &&
            localCurrency &&
            currency !== localCurrency
        ) {
            const raw = await safe(() =>
                currencyConversionTool.invoke({
                    amount: budget,
                    from: currency,
                    to: localCurrency,
                }),
            );
            const parsed = parseJson<{ converted?: number }>(raw);
            return {
                currency: raw,
                budgetLimitLocal:
                    parsed?.converted != null ? parsed.converted : budget,
            };
        }
        return {
            currency: null,
            budgetLimitLocal: budget ?? null,
        };
    };

    const weatherTask = async () => {
        if (!destination || !startDate || !endDate) return { weather: null };
        return {
            weather: await safe(() =>
                weatherInfoTool.invoke({
                    location: destination,
                    startDate,
                    endDate,
                }),
            ),
        };
    };

    const placesTask = async () => {
        if (!destination) return { places: null };
        const categories = mapInterestsToGeoapify(interests ?? []);
        const apiKey = process.env.GEOAPIFY_API_KEY;
        if (!apiKey) {
            console.error("GEOAPIFY_API_KEY is missing");
            return { places: null };
        }
        return {
            places: await safe(() =>
                placeSearchTool(apiKey).invoke({
                    destination,
                    categories,
                }),
            ),
        };
    };

    const [fx, weather, places] = await Promise.all([
        currencyTask(),
        weatherTask(),
        placesTask(),
    ]);

    return {
        currency: fx.currency,
        budgetLimitLocal: fx.budgetLimitLocal,
        weather: weather.weather,
        places: places.places,
    };
}

function buildDraftContext(state: S): string {
    const parts = [
        `Trip request: ${JSON.stringify(state.request)}`,
        `Budget limit (local): ${state.budgetLimitLocal ?? "none"}`,
        `Budget conversion: ${state.currency ? JSON.stringify(state.currency) : "n/a"}`,
        `Weather: ${state.weather ? JSON.stringify(state.weather) : "unavailable — say so rather than guessing"}`,
        `Candidate places: ${state.places ? JSON.stringify(state.places) : "none found"}`,
    ];
    if (state.refineFeedback) {
        parts.push(`REFINE FEEDBACK (mandatory): ${state.refineFeedback}`);
    }
    return parts.join("\n");
}

// 4. draft — structured itinerary; optional Tavily loop
export async function draftNode(state: S) {
    const context = buildDraftContext(state);
    const searchesDone = state.messages.filter(
        (m) => m instanceof ToolMessage,
    ).length;
    const interests = state.request?.interests ?? [];
    const wantsSearch =
        searchesDone < MAX_SEARCHES &&
        !state.refineFeedback &&
        (!hasPlaces(state.places) || interestsNeedLiveSearch(interests));

    if (wantsSearch) {
        const response = await plannerWithTools.invoke([
            new SystemMessage(DRAFT_PROMPT),
            new HumanMessage(
                `${context}\n\nIf you need live events/hours/closures, call the search tool. Otherwise reply with the itinerary.`,
            ),
            ...state.messages,
        ]);

        const ai = response as AIMessage;
        if (ai.tool_calls?.length) {
            return { messages: [response] };
        }
    }

    const itinerary = await planner
        .withStructuredOutput(ItinerarySchema)
        .invoke([
            new SystemMessage(DRAFT_PROMPT),
            new HumanMessage(context),
            ...state.messages,
        ]);

    return { itinerary };
}

// 5. validate — deterministic budget check via calculator
export async function validateNode(state: S) {
    const itinerary = state.itinerary;
    if (!itinerary) {
        return {
            budgetCheck: {
                total: 0,
                limit: state.budgetLimitLocal ?? 0,
                currency:
                    state.request?.localCurrency ??
                    state.request?.currency ??
                    "UNK",
                withinBudget: true,
                overBy: 0,
            } satisfies BudgetCheck,
        };
    }

    const costs = activityCosts(itinerary);
    let total = 0;
    for (const cost of costs) {
        const next = await calculatorTool.invoke({
            op: "add",
            a: total,
            b: cost,
        });
        total = Number(next);
    }

    // Prefer summed activities; keep schema total in sync for downstream
    const limit = state.budgetLimitLocal;
    const currency =
        itinerary.totalEstimatedCost.currency ||
        state.request?.localCurrency ||
        state.request?.currency ||
        "UNK";

    if (limit == null) {
        return {
            budgetCheck: {
                total,
                limit: total,
                currency,
                withinBudget: true,
                overBy: 0,
            } satisfies BudgetCheck,
            itinerary: {
                ...itinerary,
                totalEstimatedCost: { amount: total, currency },
            },
        };
    }

    const overByRaw = await calculatorTool.invoke({
        op: "subtract",
        a: total,
        b: limit,
    });
    const overBy = Math.max(0, Number(overByRaw));
    const withinBudget = total <= limit;

    return {
        budgetCheck: {
            total,
            limit,
            currency,
            withinBudget,
            overBy,
        } satisfies BudgetCheck,
        itinerary: {
            ...itinerary,
            totalEstimatedCost: { amount: total, currency },
        },
    };
}

// 6. refine — feed budget pressure back into draft
export function refineNode(state: S) {
    const check = state.budgetCheck;
    const currency = check?.currency ?? "local currency";
    const overBy = check?.overBy ?? 0;
    const total = check?.total ?? 0;
    const limit = check?.limit ?? 0;

    return {
        refineCount: state.refineCount + 1,
        refineFeedback: `Budget exceeded by ${overBy} ${currency}. Current total ${total}, limit ${limit}. Replace paid activities with free or cheaper options, shorten paid experiences, and bring totalEstimatedCost under ${limit} ${currency}.`,
        itinerary: null,
    };
}
