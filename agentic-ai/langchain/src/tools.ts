import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage, tool } from "langchain";
import z from "zod";

const model = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});

export const getWeather = tool(
    (input) => `It's always sunny in ${input.city}!`,
    {
        name: "get_weather",
        description: "Get the weather for a given city",
        schema: z.object({
            city: z.string().describe("The city to get the weather for"),
        }),
    },
);

const modelWithTools = model.bindTools([getWeather]);

// Step 1: Model generates tool calls
const messages = [{ role: "user", content: "What's the weather in Boston?" }];

const ai_msg = await modelWithTools.invoke(messages);

messages.push(ai_msg);

// Step 2: Execute tools and collect results
for (const tool_call of ai_msg.tool_calls) {
    // Execute the tool with the generated arguments
    const tool_result = await getWeather.invoke(tool_call);
    messages.push(tool_result);
}

// Step 3: Pass results back to model for final response
const final_response = await modelWithTools.invoke(messages);
console.log(final_response.text);
// "The current weather in Boston is 72°F and sunny."

// Structured Output
const Movie = z.object({
    title: z.string().describe("The title of the movie"),
    year: z.number().describe("The year the movie was released"),
    director: z.string().describe("The director of the movie"),
    rating: z.number().describe("The movie's rating out of 10"),
});

const modelWithStructure = model.withStructuredOutput(Movie);

const response = await modelWithStructure.invoke(
    "Provide details about the movie Inception",
);
console.log("\n", response);
