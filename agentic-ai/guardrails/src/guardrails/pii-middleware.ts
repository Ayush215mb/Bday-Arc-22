import { createMiddleware, HumanMessage, ToolMessage } from "langchain";
import { piiGuardrail, type PIIType } from "./pii-guardrail";

export const piiMiddleware = (types?: PIIType[]) =>
    createMiddleware({
        name: "PIIGuardrail",
        // Runs before every LLM call
        beforeModel: (state) => {
            const updates: (HumanMessage | ToolMessage)[] = [];

            for (const msg of state.messages) {
                const kind = msg.type;
                if (
                    (kind !== "human" && kind !== "tool") ||
                    typeof msg.content !== "string"
                )
                    continue;

                const { flagged, redacted } = piiGuardrail(msg.content, types);
                if (!flagged) continue;

                // Same id => the messages reducer replaces the original in state
                updates.push(
                    kind === "human"
                        ? new HumanMessage({ id: msg.id, content: redacted })
                        : new ToolMessage({
                              id: msg.id,
                              content: redacted,
                              tool_call_id: (msg as ToolMessage).tool_call_id,
                          }),
                );
            }

            return updates.length ? { messages: updates } : undefined;
        },
    });
