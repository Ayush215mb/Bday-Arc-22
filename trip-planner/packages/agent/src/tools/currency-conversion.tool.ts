import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { convertCurrency } from "../services/currency-converter";

export const currencyConversionTool = tool(
    async ({ amount, from, to }) =>
        JSON.stringify(await convertCurrency(amount, from, to)),
    {
        name: "currencyConversionTool",
        description:
            "Convert an amount between currencies using ISO codes like USD, INR.",
        schema: z.object({
            amount: z.number(),
            from: z.string().length(3),
            to: z.string().length(3),
        }),
    },
);
