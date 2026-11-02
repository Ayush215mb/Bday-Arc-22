import { Compass } from "lucide-react";
import { SITE } from "@/lib/content";

export function Logo() {
    return (
        <span className="group flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-sun transition-transform duration-500 group-hover:rotate-200">
                <Compass className="size-5" />
            </span>
            <span className="hidden font-display text-lg font-black sm:block">
                {SITE.name}
            </span>
        </span>
    );
}
