import type { LucideIcon } from "lucide-react";

interface SuggestionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onSelect: () => void;
}

export default function SuggestionCard({
    icon: Icon,
    title,
    description,
    onSelect,
}: SuggestionCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="flex h-full w-full flex-col items-start gap-1.5 rounded-2xl border border-white/[0.07] bg-[#11303c]/50 p-3.5 text-left transition-colors hover:bg-[#15394a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
        >
            <span className="flex items-center gap-2 text-[13px] font-semibold text-white">
                <Icon className="h-4 w-4" aria-hidden />
                {title}
            </span>
            <span className="text-xs leading-snug text-white/40">
                {description}
            </span>
        </button>
    );
}
