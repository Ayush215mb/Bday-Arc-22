import { createMiddleware, AIMessage } from "langchain";

// The 10 flag words. Suffixes (s/ed/ing/er/ers) are matched, so "hacking" is
// caught but "hackathon" is not.
export const ILLEGAL_WORDS = [
    "hack",
    "biryani", //for testing coz the model already has guardrails about every other word
    "malware",
    "ransomware",
    "phishing",
    "ddos",
    "counterfeit",
    "launder",
    "explosive",
    "trafficking",
    "carding",
] as const;

const PATTERN = new RegExp(
    `\\b(${ILLEGAL_WORDS.join("|")})(?:s|ed|ing|er|ers)?\\b`,
    "i",
);

export const illegalRequestMiddleware = () =>
    createMiddleware({
        name: "IllegalRequestGuardrail",
        // Runs once per invocation, before any model call
        beforeAgent: {
            hook: (state) => {
                const lastHuman = [...(state.messages ?? [])]
                    .reverse()
                    .find((m) => m._getType() === "human");
                if (!lastHuman) return;

                const hit = PATTERN.exec(lastHuman.content.toString());
                if (!hit) return;

                return {
                    messages: [
                        new AIMessage(
                            `I can't help with that. Your request mentions "${hit[1].toLowerCase()}", ` +
                                `which I treat as illegal activity. I'm happy to help with a lawful alternative.`,
                        ),
                    ],
                    jumpTo: "end",
                };
            },
            canJumpTo: ["end"],
        },
    });
