"use client";

import { motion } from "motion/react";
import { Repeat } from "lucide-react";
import type { StepKind } from "@/lib/content";

function Extract() {
    const chips = [
        ["destination", "Kyoto"],
        ["days", "5"],
        ["budget", "¥80,000"],
        ["vibe", "temples, food"],
    ];
    return (
        <div className="space-y-4">
            <p className="font-medium">
                “Plan 5 days in Kyoto under ¥80,000, food and temples”
            </p>
            <div className="flex flex-wrap gap-2">
                {chips.map(([k, v], i) => (
                    <motion.span
                        key={k}
                        initial={{ scale: 0, rotate: -12 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.2 + i * 0.12,
                            type: "spring",
                            stiffness: 300,
                            damping: 14,
                        }}
                        className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-sm font-bold"
                    >
                        <span className="opacity-60">{k}</span> {v}
                    </motion.span>
                ))}
            </div>
        </div>
    );
}

function Parallel() {
    const rows = [
        ["Currency", "bg-goji", 1.8],
        ["Weather", "bg-sun", 2.6],
        ["Places", "bg-leaf", 3.4],
    ] as const;
    return (
        <div className="space-y-4">
            {rows.map(([label, tone, duration]) => (
                <div key={label}>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest">
                        {label}
                    </p>
                    <div className="h-4 overflow-hidden rounded-full border-2 border-ink bg-cream">
                        <motion.div
                            className={`h-full ${tone}`}
                            animate={{ width: ["0%", "100%", "100%"] }}
                            transition={{
                                duration,
                                repeat: Infinity,
                                repeatDelay: 0.8,
                                ease: "easeInOut",
                                times: [0, 0.8, 1],
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Node({
    label,
    tone,
    delay,
}: {
    label: string;
    tone: string;
    delay: number;
}) {
    return (
        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, delay }}
            className={`rounded-2xl border-2 border-ink px-4 py-3 font-display text-lg font-black ${tone}`}
        >
            {label}
        </motion.div>
    );
}

function Loop() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <Node label="Planner" tone="bg-sun" delay={0} />
                <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <Repeat className="size-8" />
                </motion.span>
                <Node label="Tavily" tone="bg-pink" delay={0.8} />
            </div>
            <div className="flex items-center gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.span
                        key={i}
                        className="h-3 flex-1 rounded-full border-2 border-ink"
                        animate={{
                            backgroundColor: ["#fff3e3", "#ff3b2f", "#ff3b2f"],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.5,
                            times: [0, 0.1, 1],
                        }}
                    />
                ))}
                <span className="ml-2 text-xs font-bold uppercase tracking-widest">
                    capped
                </span>
            </div>
        </div>
    );
}

function Format() {
    return (
        <pre className="overflow-x-auto rounded-xl bg-ink p-4 text-[13px] leading-relaxed text-cream">
            <code>{`{
  "destination": "Kyoto",
  "summary": "Temples, food, one live show",
  "totalCost": 78400,
  "days": [
    { "day": 1, "activities": [ … ] }
  ]
}`}</code>
        </pre>
    );
}

const VISUALS = {
    extract: Extract,
    parallel: Parallel,
    loop: Loop,
    format: Format,
};

export function PipelineVisual({ kind }: { kind: StepKind }) {
    const Visual = VISUALS[kind];
    return <Visual />;
}
