import { tool } from "langchain";
import z from "zod";
import { getWeather } from "../services/get-weather";

export const weatherInfoTool = tool(
    async ({ location, startDate, endDate }) => {
        try {
            return JSON.stringify(
                await getWeather({ location, startDate, endDate }),
            );
        } catch (e) {
            return `Error: ${e instanceof Error ? e.message : "weather apis failed"}`;
        }
    },
    {
        name: "weatherInfoTool",
        description:
            "Tool for checking weather of any location for the next X days",
        schema: z.object({
            location: z.string(),
            startDate: z.string(),
            endDate: z.string(),
        }),
    },
);
