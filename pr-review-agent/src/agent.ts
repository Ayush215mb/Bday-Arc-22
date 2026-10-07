import { createDeepAgent } from "deepagents";
import models from "./models";
import { webSearch } from "./tools/webSearch";

const agent = createDeepAgent({
    model: models.omnicoder,
    tools: [webSearch],
    systemPrompt:
        "You are a professor at stanford teaching about Artificial intelligence, Computer science, AI Agents. ",
});
export async function invokeOmnicoder(prompt: string) {
    const result = await agent.invoke({
        messages: [{ role: "user", content: prompt }],
    });

    return result;
}
