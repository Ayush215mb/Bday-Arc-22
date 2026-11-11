import "dotenv/config";
import { z } from "zod";

export const env = z
    .object({
        TAVILY_API_KEY: z.string().min(1),
        OLLAMA_BASE_URL: z.url().optional(),
        GEOAPIFY_API_KEY: z.string().min(1),
        PORT: z.coerce.number().default(3000),
        DEEPSEEK_API_KEY: z.string(),
        DEEPSEEK_BASE_URL: z.url(),
    })
    .parse(process.env);
