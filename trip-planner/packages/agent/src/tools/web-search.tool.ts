import { type SearchDepth, TavilySearch } from "@langchain/tavily";

export const WebSearchTool = (apikey: string, SearchDepth: SearchDepth) => {
    return new TavilySearch({
        tavilyApiKey: apikey,
        searchDepth: SearchDepth,
        maxResults: 3,
    });
};
