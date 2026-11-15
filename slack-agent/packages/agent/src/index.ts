import "dotenv/config";
import { Agent } from "./agent";
import { deepseekModel } from "./models/deepseek-model";

const deepseekAgent = Agent({ model: deepseekModel });

const prompt = "who r u?";
const res = await deepseekAgent.generate({ prompt: prompt });

console.log("prompt:", prompt, "\noutput:", res.output);
