"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";

const LINKS = [
    { href: "/", label: "Home" },
    { href: "/plan", label: "Plan" },
    { href: "/dev", label: "Dev" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed inset-x-0 top-4 -z-50 flex justify-center px-4">
            <nav className="flex items-center gap-1 rounded-full border-2 border-ink bg-cream/90 p-1.5 shadow-hard backdrop-blur">
                <Link href="/" className="mr-2 pl-1" aria-label="Home">
                    <Logo />
                </Link>
                {LINKS.map(({ href, label }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="relative rounded-full px-4 py-2 text-sm font-bold"
                        >
                            {active && (
                                <motion.span
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-full border-2 border-ink bg-goji"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative">{label}</span>
                        </Link>
                    );
                })}
                <LinkButton
                    href="/plan"
                    size="sm"
                    variant="sun"
                    className="ml-2 hidden sm:inline-flex"
                >
                    Start planning
                </LinkButton>
            </nav>
        </header>
    );
}
