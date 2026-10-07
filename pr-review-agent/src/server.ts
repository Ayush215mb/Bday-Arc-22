import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import { invokeOmnicoder } from "./agent";

const app: Express = express();
const port = process.env.PORT ?? 8000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("This is the backend of a multi agent system which can ");
});

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});
app.post("/omnicoder", async (req: Request, res: Response) => {
    const { prompt } = req.body ?? {};

    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "`prompt` (string) is required" });
    }

    try {
        const result = await invokeOmnicoder(prompt);
        const messages = result.messages.map((m: any) => ({
            role: m.getType?.() ?? m.role,
            content: m.content,
        }));
        res.json({ messages, answer: messages.at(-1)?.content });
    } catch (err) {
        console.error("omnicoder failed:", err);
        res.status(500).json({ error: "Agent invocation failed" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
