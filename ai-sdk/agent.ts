import { ToolLoopAgent } from "ai";
import { deepSeekModel } from "./index";

export const myAgent = new ToolLoopAgent({
    model: deepSeekModel("deepseek/deepseek-v4.1-flash"),
    instructions: "You are a helpful assistant.",
    tools: {
        // Your tools here
    },
});
