"use client";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { TOOLS } from "@/lib/content";

type Tool = (typeof TOOLS)[number];

function ToolCard({ tool }: { tool: Tool }) {
    const Icon = tool.icon;
    return (
        <div
            className={cn(
                "group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-ink p-6 shadow-hard transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1",
                tool.tone,
            )}
        >
            <Icon
                aria-hidden
                className="absolute -bottom-6 -right-6 size-36 opacity-15 transition-transform duration-500 group-hover:rotate-[24deg] group-hover:scale-110"
            />
            <span className="grid size-12 place-items-center rounded-2xl border-2 border-ink bg-white">
                <Icon className="size-6" />
            </span>
            <div className="relative">
                <h3 className="font-display text-2xl font-black">
                    {tool.name}
                </h3>
                <p className="mt-1 max-w-sm font-medium leading-snug">
                    {tool.body}
                </p>
            </div>
        </div>
    );
}

export function ToolsBento() {
    return (
        <section className="px-6 py-28">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-goji">
                        Toolbox
                    </p>
                    <h2 className="font-display text-5xl font-black leading-[0.95] sm:text-7xl">
                        Five tools.
                        <br />
                        Zero guessing.
                    </h2>
                </Reveal>

                <div className="mt-12 grid auto-rows-[200px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {TOOLS.map((tool, i) => (
                        <Reveal
                            key={tool.name}
                            delay={i * 0.07}
                            className={cn("h-full", tool.span)}
                        >
                            <ToolCard tool={tool} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
