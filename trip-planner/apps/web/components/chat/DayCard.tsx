"use client";

import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCost } from "@/lib/itinerary";
import type { Activity, ItineraryDay } from "@/lib/types";

const TONES = ["bg-goji", "bg-sun", "bg-pink", "bg-leaf"];

function ActivityItem({ activity }: { activity: Activity }) {
    const cost = formatCost(activity.cost);
    return (
        <li className="relative border-l-2 border-dashed border-ink/30 pl-5">
            <span className="absolute -left-[7px] top-1.5 size-3 rounded-full border-2 border-ink bg-cream" />
            <div className="flex flex-wrap items-center gap-2">
                {activity.time && (
                    <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold text-cream">
                        {activity.time}
                    </span>
                )}
                <h5 className="font-bold">{activity.name}</h5>
                {cost && (
                    <span className="rounded-full border-2 border-ink bg-sun px-2 py-0.5 text-xs font-bold">
                        {cost}
                    </span>
                )}
            </div>
            {activity.description && (
                <p className="mt-1 text-sm text-ink/75">
                    {activity.description}
                </p>
            )}
            {activity.location && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-ink/60">
                    <MapPin className="size-3.5" /> {activity.location}
                </p>
            )}
        </li>
    );
}

export function DayCard({ day, index }: { day: ItineraryDay; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 28, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{
                delay: 0.15 + index * 0.08,
                type: "spring",
                stiffness: 140,
                damping: 18,
            }}
            className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-hard"
        >
            <header
                className={cn(
                    "flex items-center gap-4 border-b-2 border-ink px-5 py-3 text-ink",
                    TONES[index % TONES.length],
                )}
            >
                <span className="font-display text-5xl font-black leading-none">
                    {String(day.day).padStart(2, "0")}
                </span>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">
                        Day
                    </p>
                    <h4 className="font-display text-xl font-black leading-tight">
                        {day.title ?? `Day ${day.day}`}
                    </h4>
                </div>
            </header>
            <ol className="space-y-5 p-5">
                {day.activities.map((a, i) => (
                    <ActivityItem key={`${a.name}-${i}`} activity={a} />
                ))}
                {day.activities.length === 0 && (
                    <li className="text-sm text-ink/50">
                        Nothing planned yet.
                    </li>
                )}
            </ol>
        </motion.article>
    );
}
