"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
    onSend: (text: string) => void;
    onStop: () => void;
    busy: boolean;
}

export function Composer({ onSend, onStop, busy }: Props) {
    const [value, setValue] = useState("");
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [value]);

    const submit = () => {
        if (!value.trim() || busy) return;
        onSend(value);
        setValue("");
    };

    const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="flex items-end gap-2 rounded-[1.75rem] border-2 border-ink bg-white p-2 shadow-hard-lg transition-shadow focus-within:shadow-[7px_7px_0_0_var(--color-goji)]">
            <textarea
                ref={ref}
                rows={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                placeholder="5 days in Kyoto, ¥80,000, temples & food…"
                className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-ink/40"
            />
            <button
                type="button"
                onClick={busy ? onStop : submit}
                disabled={!busy && !value.trim()}
                aria-label={busy ? "Stop" : "Send"}
                className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100",
                    busy ? "bg-ink text-cream" : "bg-goji",
                )}
            >
                {busy ? (
                    <Square className="size-4 fill-current" />
                ) : (
                    <ArrowUp className="size-5" />
                )}
            </button>
        </div>
    );
}
