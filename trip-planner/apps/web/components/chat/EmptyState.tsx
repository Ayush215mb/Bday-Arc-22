"use client";

import { motion } from "motion/react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/cn";
import { SUGGESTIONS } from "@/lib/content";

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
    return (
        <div className="flex min-h-full flex-col items-center justify-center py-10 text-center">
            <motion.div
                initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: -6, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 12 }}
                className="mb-6 grid size-20 place-items-center rounded-3xl border-2 border-ink bg-goji shadow-hard-lg"
            >
                <Plane className="size-9" />
            </motion.div>
            <h1 className="font-display text-6xl font-black leading-none sm:text-7xl">
                Where to?
            </h1>
            <p className="mt-4 max-w-md text-ink/70">
                Tell me the place, the days and the budget. I’ll do the legwork.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                {SUGGESTIONS.map((s, i) => (
                    <motion.button
                        key={s.label}
                        type="button"
                        onClick={() => onPick(s.prompt)}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        whileHover={{ rotate: i % 2 ? 2 : -2, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        className={cn(
                            "rounded-full border-2 border-ink px-4 py-2 text-sm font-bold shadow-hard",
                            s.tone,
                        )}
                    >
                        {s.label}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
