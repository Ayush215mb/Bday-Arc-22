import { z } from "zod";

export const planSchema = z.object({
    threadId: z.string().default(() => crypto.randomUUID()),
    prompt: z.string().min(1),
});
