import { TavilySearch } from "@langchain/tavily";
import { tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

export const webSearch = tool(
    async ({
        query,
        searchDepth,
        maxResults = 5,
        topic = "general",
        includeRawContent = false,
    }: {
        query: string;
        maxResults?: number;
        searchDepth: "basic" | "advanced";
        topic?: "general" | "news" | "finance";
        includeRawContent?: boolean;
    }) => {
        const tavilySearch = new TavilySearch({
            maxResults,
            tavilyApiKey: process.env.TAVILY_API_KEY,
            searchDepth: searchDepth,
            includeRawContent,
            topic,
        });
        return await tavilySearch._call({ query });
    },
    {
        name: "Web Search",
        description:
            "Do an web search to find latest information about anything ",
        schema: z.object({
            query: z.string().describe("The search query"),
            searchDepth: z.enum(["basic", "advanced"]),
            maxResults: z
                .number()
                .optional()
                .default(5)
                .describe("Maximum number of results to return"),
            topic: z
                .enum(["general", "news", "finance"])
                .optional()
                .default("general")
                .describe("Search topic category"),
            includeRawContent: z
                .boolean()
                .optional()
                .default(false)
                .describe("Whether to include raw content"),
        }),
    },
);
