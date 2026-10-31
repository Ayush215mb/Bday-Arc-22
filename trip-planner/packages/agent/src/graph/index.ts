import { StateGraph, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { State, type S } from "./state";
import * as n from "./nodes";

type Next = "currency" | "weather" | "places" | typeof END;

const route = {
    afterExtract: (s: S): Next | Next[] =>
        s.question ? END : ["currency", "weather", "places"],
    afterPlanner: (s: S) => {
        const last = s.messages.at(-1) as AIMessage;
        return last?.tool_calls?.length ? "tools" : "format";
    },
};
export const graph = new StateGraph(State)
    .addNode("extract", n.extractNode)
    .addNode("convert_currency", n.currencyNode)
    .addNode("get_weather", n.weatherNode)
    .addNode("find_places", n.placesNode)
    .addNode("planner", n.plannerNode)
    .addNode("tools", new ToolNode([n.tavily]))
    .addNode("format", n.formatNode)

    .addEdge(START, "extract")
    .addConditionalEdges("extract", route.afterExtract)
    .addEdge(["convert_currency", "get_weather", "find_places"], "planner")
    .addConditionalEdges("planner", route.afterPlanner, {
        tools: "tools",
        format: "format",
    })
    .addEdge("tools", "planner")
    .addEdge("format", END)
    .compile();
