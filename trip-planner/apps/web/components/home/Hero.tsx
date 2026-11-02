"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { DotGrid } from "@/components/ui/DotGrid";
import { SplitWords } from "@/components/ui/SplitWords";
import { FloatingStickers } from "./FloatingStickers";
import { RouteDraw } from "./RouteDraw";
import { WordSlot } from "./WordSlot";

export function Hero() {
    return (
        <section className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pb-24 pt-32">
            <DotGrid />
            <RouteDraw />
            <FloatingStickers />

            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <motion.span
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-1.5 text-sm font-bold shadow-hard"
                >
                    <Sparkles className="size-4" /> Local AI agent · Live data ·
                    Day-by-day
                </motion.span>

                <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-black leading-[0.92] tracking-tight">
                    <SplitWords text="Plan a week in" />
                    <br />
                    <WordSlot />
                    <br />
                    <SplitWords text="without 40 tabs." delay={0.35} />
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="mt-8 max-w-xl text-lg font-medium leading-snug text-ink/75"
                >
                    An agent that pulls real places, weather and exchange rates,
                    does the maths, then writes your itinerary, streaming live
                    as it thinks.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.15, duration: 0.6 }}
                    className="mt-10 flex flex-wrap gap-4"
                >
                    <LinkButton href="/plan" size="lg">
                        Plan my trip <ArrowRight className="size-5" />
                    </LinkButton>
                    <LinkButton href="#how" size="lg" variant="ghost">
                        See how it thinks
                    </LinkButton>
                </motion.div>
            </div>
        </section>
    );
}
