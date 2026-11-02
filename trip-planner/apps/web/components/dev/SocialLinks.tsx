import { cn } from "@/lib/cn";
import { DEV } from "@/lib/dev-content";

const TONES = ["bg-goji", "bg-sun", "bg-pink", "bg-leaf", "bg-cream", "bg-sun"];

export function SocialLinks() {
    return (
        <ul className="flex flex-wrap gap-3">
            {DEV.links.map(({ label, href, icon: Icon }, i) => (
                <li key={label}>
                    <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className={cn(
                            "group inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-bold shadow-hard transition-all hover:-translate-y-1 hover:shadow-hard-lg",
                            TONES[i % TONES.length],
                        )}
                    >
                        <Icon className="size-5 transition-transform group-hover:rotate-12" />
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    );
}
