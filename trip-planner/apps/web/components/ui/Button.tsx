import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "goji" | "ink" | "sun" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
    goji: "bg-goji text-ink",
    ink: "bg-ink text-cream",
    sun: "bg-sun text-ink",
    ghost: "bg-cream text-ink",
};

const SIZES: Record<Size, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
};

export const buttonStyles = (variant: Variant = "goji", size: Size = "md") =>
    cn(
        "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink font-bold shadow-hard transition-all duration-150",
        "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
        VARIANTS[variant],
        SIZES[size],
    );

interface LinkButtonProps {
    href: string;
    variant?: Variant;
    size?: Size;
    className?: string;
    children: ReactNode;
}

export function LinkButton({
    href,
    variant,
    size,
    className,
    children,
}: LinkButtonProps) {
    const cls = cn(buttonStyles(variant, size), className);
    return href.startsWith("http") ? (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
            {children}
        </a>
    ) : (
        <Link href={href} className={cls}>
            {children}
        </Link>
    );
}

export function Button({
    variant,
    size,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
}) {
    return (
        <button
            className={cn(buttonStyles(variant, size), className)}
            {...props}
        />
    );
}
