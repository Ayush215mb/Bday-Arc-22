import {
    StateGraph,
    START,
    END,
    MemorySaver,
    interrupt,
} from "@langchain/langgraph";
import { State, type S } from "./state";
import { draft_node, plan_node, research_node } from "./nodes";

const MAX_ASKS = 2;

const ask_user_node = async (state: S) => {
    // pauses the graph; the value passed to Command({ resume }) comes back here
    const answer = interrupt({
        type: "missing_info",
        questions: state.research?.missingInfo ?? [],
    });

    return {
        userInput: `${state.userInput}\n\nAdditional details from the user: ${String(answer)}`,
        askCount: state.askCount + 1,
    };
};

const routeAfterResearch = (s: S): "ask_user_node" | "plan_node" =>
    (s.research?.missingInfo.length ?? 0) > 0 && s.askCount < MAX_ASKS
        ? "ask_user_node"
        : "plan_node";

export const graph = new StateGraph(State)
    .addNode("draft_node", draft_node)
    .addNode("research_node", research_node)
    .addNode("ask_user_node", ask_user_node)
    .addNode("plan_node", plan_node)
    .addEdge(START, "draft_node")
    .addEdge("draft_node", "research_node")
    .addConditionalEdges("research_node", routeAfterResearch, [
        "ask_user_node",
        "plan_node",
    ])
    .addEdge("ask_user_node", "draft_node")
    .addEdge("plan_node", END)
    .compile({ checkpointer: new MemorySaver() }); // interrupt() requires a checkpointer
