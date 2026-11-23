import { loadDeepseek } from "./models/model-loader";
import { existingModels } from "./schemas";
import "dotenv/config";
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

// const agent = createTripPlannerAgent({
//     model: deepseek,
//     systemPrompt: SYSTEM_PROMPT,
// });

// const result = await agent.invoke({
//     messages: [new HumanMessage("plan a trip to thailand")],
// });

console.log(await deepseek.invoke("plan a trip to thailand"));
