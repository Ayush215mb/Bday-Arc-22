"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Compass } from "lucide-react";
import { parseItinerary } from "@/lib/itinerary";
import type { ChatMessage } from "@/lib/types";
import { ItineraryView } from "./ItineraryView";
import { MarkdownView } from "./MarkdownView";
import { ThinkingIndicator } from "./ThinkingIndicator";

const looksStructured = (t: string) => /^\s*(```(?:json)?\s*)?\{/.test(t);
const enter = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
};

export function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user";
    const streaming = message.status === "streaming";
    const itinerary = useMemo(
        () => (isUser || streaming ? null : parseItinerary(message.content)),
        [isUser, streaming, message.content],
    );

    if (isUser) {
        return (
            <motion.div {...enter} className="flex justify-end">
                <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md border-2 border-ink bg-ink px-5 py-3 text-cream shadow-[4px_4px_0_0_var(--color-goji)]">
                    {message.content}
                </p>
            </motion.div>
        );
    }

    let body;
    if (message.status === "error") {
        body = (
            <p className="font-bold text-goji">
                Couldn’t reach the planner.{" "}
                <span className="font-medium text-ink/70">
                    {message.content}
                </span>
            </p>
        );
    } else if (
        !message.content ||
        (streaming && looksStructured(message.content))
    ) {
        body = (
            <ThinkingIndicator
                label={message.content ? "Drafting your itinerary" : undefined}
            />
        );
    } else {
        body = (
            <>
                <MarkdownView>{message.content}</MarkdownView>
                {streaming && (
                    <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-goji align-middle" />
                )}
            </>
        );
    }

    return (
        <motion.div {...enter} className="flex gap-3">
            <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-sun">
                <Compass className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
                {itinerary ? (
                    <ItineraryView data={itinerary} />
                ) : (
                    <div className="inline-block max-w-full rounded-3xl rounded-tl-md border-2 border-ink bg-white px-5 py-4 shadow-hard">
                        {body}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
