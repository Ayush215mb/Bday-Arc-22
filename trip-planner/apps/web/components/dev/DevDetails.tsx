import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { DEV } from "@/lib/dev-content";

const TONES = ["bg-goji", "bg-sun", "bg-pink", "bg-leaf"];

export function DevDetails() {
    return (
        <div className="relative z-10 space-y-16">
            <section className="grid gap-5 sm:grid-cols-3">
                {DEV.highlights.map(({ icon: Icon, title, body }, i) => (
                    <Reveal key={title} delay={i * 0.08}>
                        <div
                            className={cn(
                                "h-full rounded-3xl border-2 border-ink p-6 shadow-hard",
                                TONES[i],
                            )}
                        >
                            <Icon className="size-8" />
                            <h3 className="mt-3 font-display text-2xl font-black">
                                {title}
                            </h3>
                            <p className="mt-1 text-sm font-medium">{body}</p>
                        </div>
                    </Reveal>
                ))}
            </section>

            <Reveal>
                <h2 className="mb-5 font-display text-4xl font-black">Stack</h2>
                <div className="space-y-4">
                    {DEV.stack.map(({ group, items }) => (
                        <div
                            key={group}
                            className="flex flex-wrap items-center gap-2"
                        >
                            <span className="w-28 text-xs font-bold uppercase tracking-widest text-ink/60">
                                {group}
                            </span>
                            {items.map((item, i) => (
                                <span
                                    key={item}
                                    className={cn(
                                        "rounded-full border-2 border-ink px-3 py-1 text-sm font-bold",
                                        TONES[i % TONES.length],
                                    )}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </Reveal>

            <Reveal>
                <h2 className="mb-5 font-display text-4xl font-black">Built</h2>
                <ul className="divide-y-2 divide-ink overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-hard">
                    {DEV.projects.map((p) => (
                        <li key={p.name}>
                            <a
                                href={p.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-sun"
                            >
                                <div>
                                    <h3 className="font-display text-xl font-black">
                                        {p.name}
                                    </h3>
                                    <p className="text-sm text-ink/70">
                                        {p.body}
                                    </p>
                                </div>
                                <ArrowUpRight className="size-6 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                            </a>
                        </li>
                    ))}
                </ul>
            </Reveal>
        </div>
    );
}
