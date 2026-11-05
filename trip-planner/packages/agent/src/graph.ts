import { Graph } from "./graph/index";

const config = { configurable: { thread_id: "graph-001" } };

const result = await Graph.invoke(
    {
        userInput:
            "Plan a 5-day trip to Kyoto for 2 people in April. Budget ¥80,000. Interested in temples, food, and one live show if anything is on.",
    },
    config,
);
console.log(result.response);
