import { suggestions } from "@/lib/data";
import SuggestionCard from "./SuggestionCard";

export default function SuggestionCards({
    onSelect,
}: {
    onSelect: (prompt: string) => void;
}) {
    return (
        <ul className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {suggestions.map((item) => (
                <li key={item.id}>
                    <SuggestionCard
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        onSelect={() => onSelect(item.prompt)}
                    />
                </li>
            ))}
        </ul>
    );
}
