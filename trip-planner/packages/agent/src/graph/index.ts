import {
    StateGraph,
    START,
    END,
    MemorySaver,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { State, MAX_REFINES, type S } from "./state";
import * as n from "./nodes";

const route = {
    afterDraft: (s: S): "tools" | "validate" => {
        // Prefer itinerary when present — old tool_call messages can linger after refine.
        if (s.itinerary) return "validate";
        const last = s.messages.at(-1);
        if (
            last instanceof AIMessage &&
            Array.isArray(last.tool_calls) &&
            last.tool_calls.length > 0
        ) {
            return "tools";
        }
        return "validate";
    },
    afterValidate: (s: S): "refine" | typeof END => {
        const over = s.budgetCheck && !s.budgetCheck.withinBudget;
        if (over && s.refineCount < MAX_REFINES) return "refine";
        return END;
    },
};

export const graph = new StateGraph(State)
    .addNode("extract", n.extractNode)
    .addNode("clarify", n.clarifyNode)
    .addNode("gather", n.gatherNode)
    .addNode("draft", n.draftNode)
    .addNode("tools", new ToolNode([n.tavily]))
    .addNode("validate", n.validateNode)
    .addNode("refine", n.refineNode)

    .addEdge(START, "extract")
    .addEdge("extract", "clarify")
    .addEdge("clarify", "gather")
    .addEdge("gather", "draft")
    .addConditionalEdges("draft", route.afterDraft, {
        tools: "tools",
        validate: "validate",
    })
    .addEdge("tools", "draft")
    .addConditionalEdges("validate", route.afterValidate, {
        refine: "refine",
        [END]: END,
    })
    .addEdge("refine", "draft")
    .compile({ checkpointer: new MemorySaver() });
