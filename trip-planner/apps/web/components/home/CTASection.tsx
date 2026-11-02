"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CTASection() {
    return (
        <section className="px-6 pb-28">
            <Reveal className="mx-auto max-w-6xl">
                <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-goji px-8 py-20 text-center shadow-hard-lg sm:py-28">
                    <motion.div
                        aria-hidden
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-[repeating-conic-gradient(var(--color-sun)_0_8deg,transparent_8deg_16deg)] [mask-image:radial-gradient(circle,#000_25%,transparent_70%)]"
                    />
                    <h2 className="relative font-display text-6xl font-black leading-[0.9] sm:text-8xl">
                        Where to
                        <br />
                        next?
                    </h2>
                    <p className="relative mx-auto mt-6 max-w-md text-lg font-medium">
                        Planning runs on local Ollama models. Tell it the place,
                        the days and the budget.
                    </p>
                    <div className="relative mt-10">
                        <LinkButton href="/plan" variant="ink" size="lg">
                            Start planning <ArrowRight className="size-5" />
                        </LinkButton>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
