import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const calculatorTool = tool(
    async ({ op, a, b }) => {
        const ops = {
            add: a + b,
            subtract: a - b,
            multiply: a * b,
            divide: b === 0 ? NaN : a / b,
        };
        return String(ops[op]);
    },
    {
        name: "calculator",
        description: "Basic arithmetic for budgets and totals.",
        schema: z.object({
            op: z.enum(["add", "subtract", "multiply", "divide"]),
            a: z.number(),
            b: z.number(),
        }),
    },
);
