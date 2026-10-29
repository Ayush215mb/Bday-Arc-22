import "dotenv/config";
import { z } from "zod";

export const env = z
    .object({
        TAVILY_API_KEY: z.string().min(1),
        OLLAMA_BASE_URL: z.string().url().optional(),
        OPEN_TRIP_API_KEY: z.string().min(1),
        PORT: z.coerce.number().default(3000),
    })
    .parse(process.env);
