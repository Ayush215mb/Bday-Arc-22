import type { Metadata } from "next";
import { DevCard } from "@/components/dev/DevCard";
import { DevDetails } from "@/components/dev/DevDetails";
import { DotGrid } from "@/components/ui/DotGrid";

export const metadata: Metadata = { title: "Dev" };

export default function DevPage() {
    return (
        <main className="relative mx-auto max-w-5xl space-y-16 px-6 pb-24 pt-32">
            <DotGrid />
            <DevCard />
            <DevDetails />
        </main>
    );
}
