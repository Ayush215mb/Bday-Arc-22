import { STACK_ITEMS } from "@/lib/content";
import { cn } from "@/lib/cn";

interface Props {
    items: string[];
    className?: string;
    reverse?: boolean;
}

function Marquee({ items, className, reverse }: Props) {
    const row = [...items, ...items];
    return (
        <div
            className={cn(
                "flex overflow-hidden border-y-2 border-ink py-3",
                className,
            )}
        >
            <div
                className={cn(
                    "flex shrink-0 animate-marquee",
                    reverse && "[animation-direction:reverse]",
                )}
            >
                {row.map((item, i) => (
                    <span
                        key={i}
                        className="mx-5 flex items-center gap-10 whitespace-nowrap font-display text-2xl font-black uppercase"
                    >
                        {item}
                        <span aria-hidden>✺</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export function MarqueeBands() {
    return (
        <div
            className="relative my-6 h-44 overflow-hidden"
            aria-label="Built with"
        >
            <div className="absolute inset-x-[-5%] top-6 -rotate-2">
                <Marquee items={STACK_ITEMS} className="bg-ink text-cream" />
            </div>
            <div className="absolute inset-x-[-5%] top-[5.5rem] rotate-2">
                <Marquee
                    items={[...STACK_ITEMS].reverse()}
                    reverse
                    className="bg-sun text-ink"
                />
            </div>
        </div>
    );
}
