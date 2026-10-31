import { tool } from "langchain";
import z from "zod";
import { findFamousPlaces } from "../services/find-famous-places";
export const placeSearchTool = (apiKey: string) =>
    tool(
        async ({ destination, categories }) => {
            try {
                return JSON.stringify(
                    await findFamousPlaces({ destination, apiKey, categories }),
                );
            } catch (e) {
                return `Error: ${e instanceof Error ? e.message : "place lookup failed"}`;
            }
        },
        {
            name: "placeSearchTool",
            description:
                "To Search the famous tourist attraction of a location",
            schema: z.object({
                destination: z.string(),
                categories: z
                    .string()
                    .array()
                    .describe("User's interests for the trip"),
            }),
        },
    );
