"use client";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { PIPELINE } from "@/lib/content";
import { PipelineVisual } from "./PipelineVisuals";

type Step = (typeof PIPELINE)[number];

function StepCard({ step, index }: { step: Step; index: number }) {
    const Icon = step.icon;
    return (
        <article
            style={{ rotate: `${index % 2 ? 1 : -1}deg` }}
            className={cn(
                "grid items-center gap-8 rounded-[2rem] border-2 border-ink p-8 shadow-hard-lg md:grid-cols-2 md:p-10",
                step.tone,
            )}
        >
            <div>
                <div className="flex items-center gap-4">
                    <span className="font-display text-8xl font-black leading-none text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">
                        {step.n}
                    </span>
                    <Icon className="size-10" />
                </div>
                <h3 className="mt-4 font-display text-4xl font-black">
                    {step.title}
                </h3>
                <p className="mt-3 max-w-md text-lg font-medium leading-snug">
                    {step.body}
                </p>
            </div>
            <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-hard">
                <PipelineVisual kind={step.kind} />
            </div>
        </article>
    );
}

export function PipelineSection() {
    return (
        <section id="how" className="relative px-6 py-28">
            <div className="mx-auto max-w-5xl">
                <Reveal>
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-goji">
                        How it works
                    </p>
                    <h2 className="font-display text-5xl font-black leading-[0.95] sm:text-7xl">
                        Four moves.
                        <br />
                        One itinerary.
                    </h2>
                </Reveal>

                <div className="mt-16 space-y-8 pb-24">
                    {PIPELINE.map((step, i) => (
                        <div
                            key={step.n}
                            className="sticky"
                            style={{ top: 110 + i * 26 }}
                        >
                            <StepCard step={step} index={i} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
