"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const PHRASES = [
    "Thinking",
    "Planning your route",
    "Weighing the budget",
    "Sketching the days",
    "Polishing the itinerary",
];

export function ThinkingIndicator({ label }: { label?: string }) {
    const [secs, setSecs] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setSecs((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const text = label ?? PHRASES[Math.floor(secs / 3) % PHRASES.length];

    return (
        <div role="status" aria-live="polite">
            <div className="flex items-center gap-3">
                <span className="flex gap-1.5">
                    {["bg-goji", "bg-sun", "bg-pink"].map((tone, i) => (
                        <motion.span
                            key={tone}
                            className={`size-2.5 rounded-full border border-ink ${tone}`}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 0.7,
                                repeat: Infinity,
                                delay: i * 0.12,
                            }}
                        />
                    ))}
                </span>
                <span className="relative inline-flex h-6 min-w-44 overflow-hidden font-bold">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={text}
                            initial={{ y: 14, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -14, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {text}…
                        </motion.span>
                    </AnimatePresence>
                </span>
                <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold tabular-nums">
                    {secs}s
                </span>
            </div>
            {secs >= 20 && (
                <p className="mt-2 text-xs text-ink/60">
                    Local models can take a minute. Hang tight.
                </p>
            )}
        </div>
    );
}
