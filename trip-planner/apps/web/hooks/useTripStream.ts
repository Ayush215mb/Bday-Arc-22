"use client";

import { useCallback, useRef, useState } from "react";
import { readSSE } from "@/lib/sse";
import type { ChatMessage } from "@/lib/types";

export type StreamPhase = "idle" | "thinking" | "streaming";

const uid = () => crypto.randomUUID();

export function useTripStream() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [phase, setPhase] = useState<StreamPhase>("idle");
    const threadId = useRef("");
    const abortRef = useRef<AbortController | null>(null);

    const patch = useCallback(
        (id: string, fn: (m: ChatMessage) => ChatMessage) =>
            setMessages((prev) => prev.map((m) => (m.id === id ? fn(m) : m))),
        [],
    );

    const send = useCallback(
        async (text: string) => {
            const message = text.trim();
            if (!message || abortRef.current) return;

            threadId.current ||= uid();
            const botId = uid();
            setMessages((p) => [
                ...p,
                { id: uid(), role: "user", content: message, status: "done" },
                {
                    id: botId,
                    role: "assistant",
                    content: "",
                    status: "streaming",
                },
            ]);
            setPhase("thinking");

            const ctrl = new AbortController();
            abortRef.current = ctrl;

            try {
                const res = await fetch("/api/trip/stream", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        threadId: threadId.current,
                        message,
                    }),
                    signal: ctrl.signal,
                });
                if (!res.ok || !res.body)
                    throw new Error(`Planner request failed (${res.status})`);

                let gotToken = false;
                for await (const evt of readSSE(res.body)) {
                    if (evt.event === "token") {
                        gotToken = true;
                        setPhase("streaming");
                        patch(botId, (m) => ({
                            ...m,
                            content: m.content + evt.data,
                        }));
                    } else if (evt.event === "error") {
                        throw new Error(
                            evt.data || "The planner reported an error",
                        );
                    } else if (evt.event === "done" && !gotToken && evt.data) {
                        patch(botId, (m) => ({ ...m, content: evt.data }));
                    }
                }
                patch(botId, (m) => ({ ...m, status: "done" }));
            } catch (err) {
                const aborted = (err as Error).name === "AbortError";
                patch(botId, (m) => ({
                    ...m,
                    status: aborted ? "done" : "error",
                    content:
                        m.content ||
                        (aborted ? "Stopped." : (err as Error).message),
                }));
            } finally {
                abortRef.current = null;
                setPhase("idle");
            }
        },
        [patch],
    );

    const stop = useCallback(() => abortRef.current?.abort(), []);

    const reset = useCallback(() => {
        abortRef.current?.abort();
        threadId.current = "";
        setMessages([]);
        setPhase("idle");
    }, []);

    return { messages, phase, send, stop, reset };
}
