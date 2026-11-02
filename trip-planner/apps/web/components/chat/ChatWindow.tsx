"use client";

import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { DotGrid } from "@/components/ui/DotGrid";
import { Button } from "@/components/ui/Button";
import { useTripStream } from "@/hooks/useTripStream";
import { Composer } from "./Composer";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";

export function ChatWindow() {
    const { messages, phase, send, stop, reset } = useTripStream();
    const scroller = useRef<HTMLDivElement>(null);
    const stick = useRef(true);
    const busy = phase !== "idle";

    const onScroll = () => {
        const el = scroller.current;
        if (el)
            stick.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 140;
    };

    useEffect(() => {
        const el = scroller.current;
        if (el && stick.current) el.scrollTo({ top: el.scrollHeight });
    }, [messages]);

    const handleSend = (text: string) => {
        stick.current = true;
        send(text);
    };

    return (
        <main className="relative mx-auto flex h-[100dvh] max-w-4xl flex-col px-4 pt-24">
            <DotGrid />
            <div
                ref={scroller}
                onScroll={onScroll}
                className="relative z-10 flex-1 overflow-y-auto pb-6 pr-1"
            >
                {messages.length === 0 ? (
                    <EmptyState onPick={handleSend} />
                ) : (
                    <div className="space-y-6 py-4">
                        {messages.map((m) => (
                            <MessageBubble key={m.id} message={m} />
                        ))}
                    </div>
                )}
            </div>

            <div className="relative z-10 space-y-3 pb-5 pt-2">
                {messages.length > 0 && !busy && (
                    <div className="flex justify-center">
                        <Button size="sm" variant="ghost" onClick={reset}>
                            <RotateCcw className="size-4" /> New trip
                        </Button>
                    </div>
                )}
                <Composer onSend={handleSend} onStop={stop} busy={busy} />
                <p className="text-center text-xs text-ink/50">
                    Enter to send · Shift+Enter for a new line
                </p>
            </div>
        </main>
    );
}
