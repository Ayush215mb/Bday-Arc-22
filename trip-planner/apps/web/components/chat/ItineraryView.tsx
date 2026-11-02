"use client";

import { motion } from "motion/react";
import { CalendarDays, Wallet, type LucideIcon } from "lucide-react";
import { formatCost } from "@/lib/itinerary";
import type { Itinerary } from "@/lib/types";
import { DayCard } from "./DayCard";

function Chip({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-leaf px-3 py-1 text-sm font-bold text-ink">
            <Icon className="size-4" /> {text}
        </span>
    );
}

export function ItineraryView({ data }: { data: Itinerary }) {
    const total = formatCost(data.totalCost, data.currency);

    return (
        <section className="space-y-5">
            <motion.header
                initial={{ opacity: 0, y: 20, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                className="relative overflow-hidden rounded-3xl border-2 border-ink bg-ink p-6 text-cream shadow-[6px_6px_0_0_var(--color-goji)]"
            >
                <div
                    aria-hidden
                    className="absolute -right-10 -top-10 size-40 rounded-full bg-sun"
                />
                <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-sun">
                    Your itinerary
                </p>
                <h2 className="relative mt-1 font-display text-5xl font-black leading-none">
                    {data.destination}
                </h2>
                {data.summary && (
                    <p className="relative mt-3 max-w-xl text-cream/80">
                        {data.summary}
                    </p>
                )}
                <div className="relative mt-4 flex flex-wrap gap-2">
                    <Chip
                        icon={CalendarDays}
                        text={`${data.days.length} days`}
                    />
                    {total && <Chip icon={Wallet} text={total} />}
                </div>
            </motion.header>

            <div className="grid gap-5">
                {data.days.map((day, i) => (
                    <DayCard key={`${day.day}-${i}`} day={day} index={i} />
                ))}
            </div>
        </section>
    );
}
