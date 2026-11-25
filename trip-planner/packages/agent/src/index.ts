import { loadDeepseek } from "./models/model-loader";
import { existingModels } from "./schemas";
import { createTripPlannerAgent } from "./agent";
import "dotenv/config";
import { HumanMessage } from "langchain";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

if (!DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not found");
if (!TAVILY_API_KEY) throw new Error("TAVILY_API_KEY not found");
if (!GEOAPIFY_API_KEY) throw new Error("GEOAPIFY_API_KEY not found");

const deepseek = loadDeepseek({
    model: existingModels.deepseek,
    apikey: DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    streaming: false,
});

const agent = createTripPlannerAgent({
    model: deepseek,
    systemPrompt: `You are an orchestrator trip planner agent. Your job is to plan a detailed itinerary for a trip using parallel subagents: spin up a small set of specialists at once, let each do a short piece of work, then synthesize and finish.


    For every user request:
    1. Write one short sentence explaining which specialists you will run in parallel.
    2. In the very next tool-calling turn, spawn exactly 2–3 subagents using multiple task() calls in that single turn. Each task must be independent so they can run in parallel.
    3. Give each subagent one narrow assignment — cover a single topic, option, or angle only.
    4. Never ask the user questions. Never spawn more than 3 subagents for one request. Do not delegate in multiple rounds unless a subagent failed.
    5. After all subagents return, write one concise synthesis and stop. No follow-up questions.

    Tools:
    1. currencyConversionTool: to convert the currency given by user to the currecy of destination country(skip if same)
    2. calculatorTool: to do any artithmetic calculations.
    3. placeSearchTool: To search specific types of places in the country/city based on the interest of user
    4. WebSearchTool: To search the internet for live information
    NOTE: If any of the tools give error or doesn't work for any reason then skip it and inform the user that u couldn't get the information regarding it.


    Do not do the specialist work yourself. Delegate all research and analysis via task(), then synthesize the results as soon as you can.`,
});

const result = await agent.invoke(
    {
        messages: [
            new HumanMessage(
                "Plan a 5-day trip to Kyoto for 2 people in december. Budget INR 800,000. Interested in temples, food, and one live show if anything is on.",
            ),
        ],
    },
    { configurable: { thread_id: "test04" } },
);

// console.log(await deepseek.invoke("plan a trip to thailand"));
console.log(result);
