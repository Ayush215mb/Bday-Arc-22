import { generateText, tool, ToolLoopAgent } from "ai";
import "dotenv/config";
import { createDeepSeek } from "@ai-sdk/deepseek";
import z from "zod";
export const deepSeekModel = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY ?? "",
    baseURL: process.env.DEEPSEEK_BASE_URL,
});

const { text } = await generateText({
    model: deepSeekModel("deepseek/deepseek-v4.1-flash"),
    prompt: "What is love?",
});

const myAgent = new ToolLoopAgent({
    model: deepSeekModel("deepseek/deepseek-v4.1-flash"),
    instructions: "You are a helpful assistant. Reply in less than 50 words",
    tools: {
        calculator: tool({
            description: "Calculator for arthmetic expression",
            inputSchema: z.object({
                a: z.number(),
                b: z.number(),
                op: z.enum(["add", "subtract", "multiply", "divide"]),
            }),
            execute: async ({ op, a, b }) => {
                const ops = {
                    add: a + b,
                    subtract: a - b,
                    multiply: a * b,
                    divide: b === 0 ? NaN : a / b,
                };
                return String(ops[op]);
            },
        }),
    },
});

const res = await myAgent.generate({
    prompt: "can you add 10 and 2919 and then again add 201 to the sum. after that multiply it by 4",
});

console.log(JSON.stringify(res, null, 2));
