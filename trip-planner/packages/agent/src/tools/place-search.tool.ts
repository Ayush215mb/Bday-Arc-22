import { tool } from "langchain";
import z from "zod";
import { prefetchPlaces } from "../services/preFetchPlaces";
import { interestsNeedLiveSearch } from "../utils/categories";

export const placeSearchTool = (apiKey: string) =>
    tool(
        async ({ destination, interests }) => {
            try {
                const { perInterest, hotels } = await prefetchPlaces(
                    destination,
                    interests,
                    apiKey,
                );
                const needsLiveSearch = interestsNeedLiveSearch(interests);

                const dataBlock = `needsLiveSearch: ${needsLiveSearch}

               Places already fetched per interest (do NOT search for places again):
               ${JSON.stringify(perInterest, null, 2)}

               Hotel candidates (no prices available):
               ${JSON.stringify(hotels, null, 2)}`;

                return dataBlock;
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
                interests: z
                    .string()
                    .array()
                    .describe("User's interests for the trip"),
            }),
        },
    );
