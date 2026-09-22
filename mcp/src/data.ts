import { z } from "zod";

export const userSchema = z.object({
    name: z.string(),
    email: z.email(),
    country: z.string(),
});

export type User = z.infer<typeof userSchema>;
export const users: User[] = [
    {
        name: "Ayush Yadav",
        email: "hello@gmail.com",
        country: "INDIA",
    },
    {
        name: "Ayush Yadav2",
        email: "hello3@gmail.com",
        country: "DUBAI",
    },
    {
        name: "Ayush Yadav3",
        email: "hello3@gmail.com",
        country: "NEPAL",
    },
];
