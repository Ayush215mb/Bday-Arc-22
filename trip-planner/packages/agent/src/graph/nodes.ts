import { ChatOllama } from "@langchain/ollama";
import { TavilySearch } from "@langchain/tavily";
import {
    SystemMessage,
    HumanMessage,
    AIMessage,
    ToolMessage,
} from "@langchain/core/messages";
import { TripRequest, ItinerarySchema, type S } from "./state";
import { currencyConversionTool } from "../tools/currency-conversion.tool";
import { calculatorTool } from "../tools/calculator.tool";
import { placeSearchTool } from "../tools/place-search.tool";
import { weatherInfoTool } from "../tools/weather-info.tool";
import { PLANNER_PROMPT } from "../prompts/planner-prompt";
import { loadModel } from "../models/model-loader";
import { existingModels } from "../models/existingModels";

const fast = loadModel({ model: existingModels.qwen, thinking: false });
const planner = loadModel({ model: existingModels.gemma, thinking: true });

export const tavily = new TavilySearch({ maxResults: 3 });
const plannerWithTools = planner.bindTools([tavily]);

// never let one failed API kill the run
const safe = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
        return await fn();
    } catch (e) {
        console.error(e);
        return null;
    }
};

// 1. extract
export async function extractNode(state: S) {
    const request = await fast
        .withStructuredOutput(TripRequest)
        .invoke([
            new SystemMessage(
                "Extract trip details from the user's message. Use null for anything not stated. Never guess.",
            ),
            new HumanMessage(state.userInput),
        ]);

    const missing = [
        !request.destination && "destination",
        !request.days && "number of days",
    ].filter(Boolean);

    return {
        request,
        question: missing.length
            ? `Could you tell me your ${missing.join(" and ")}?`
            : null,
    };
}

// 2a. currency
export async function currencyNode(state: S) {
    const { budget, currency, localCurrency } = state.request!;
    if (!budget || !currency || !localCurrency || currency === localCurrency)
        return { currency: null };
    return {
        currency: await safe(() =>
            currencyConversionTool.invoke({
                amount: budget,
                from: currency,
                to: localCurrency,
            }),
        ),
    };
}

// 2b. weather
export async function weatherNode(state: S) {
    return {
        weather: await safe(() =>
            weatherInfoTool.invoke({
                location: state.request!.destination!,
                startDate: state.request?.startDate!,
                endDate: state.request?.endDate!,
            }),
        ),
    };
}

// 2c. places: one search per interest, in parallel
export async function placesNode(state: S) {
    const { destination, interests } = state.request!;
    if (!destination) return `no destination provided`;
    const topics = interests.length ? interests : ["top attractions"];
    const results = await safe(() =>
        placeSearchTool(process.env.GEOAPIFY_API_KEY!).invoke({
            categories: topics,
            destination: destination,
        }),
    );

    return { places: results };
}

// 3. planner (loops with tools)
export const MAX_SEARCHES = 2;

export async function plannerNode(state: S) {
    const { request, weather, places, currency } = state;

    const context = `
Trip request: ${JSON.stringify(request)}
Budget conversion: ${currency ? JSON.stringify(currency) : "unavailable"}
Weather: ${weather ? JSON.stringify(weather) : "unavailable, say so rather than guessing"}
Candidate places: ${places?.length ? JSON.stringify(places) : "none found"}

Build a day-by-day itinerary. Use the search tool only if you need live info
(opening hours, events, closures) that isn't covered above.`;

    const searchesDone = state.messages.filter(
        (m) => m instanceof ToolMessage,
    ).length;
    const model = searchesDone >= MAX_SEARCHES ? planner : plannerWithTools; // stop offering tools after the cap

    const response = await model.invoke([
        new SystemMessage(PLANNER_PROMPT),
        new HumanMessage(context),
        ...state.messages,
    ]);
    return { messages: [response] };
}

// 4. format
export async function formatNode(state: S) {
    const lastAI = [...state.messages]
        .reverse()
        .find((m) => m instanceof AIMessage);
    const itinerary = await fast
        .withStructuredOutput(ItinerarySchema)
        .invoke([
            new SystemMessage(
                "Convert this itinerary into the required schema. Don't add or change any content.",
            ),
            new HumanMessage(String(lastAI?.content ?? "")),
        ]);
    return { itinerary };
}
