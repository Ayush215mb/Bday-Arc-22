import Link from "next/link";
import { SITE } from "@/lib/content";

export function Footer() {
    return (
        <footer className="border-t-2 border-ink px-6 py-8">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm font-medium">
                <span>
                    © {new Date().getFullYear()} {SITE.name}
                </span>
                <Link
                    href="/dev"
                    className="font-bold underline decoration-goji decoration-4 underline-offset-4 transition-colors hover:decoration-sun"
                >
                    Built by glevoidd →
                </Link>
            </div>
        </footer>
    );
}
