"use client";

import { useEffect, useRef } from "react";

export function DotGrid() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const move = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--mx", `${e.clientX - r.left}px`);
            el.style.setProperty("--my", `${e.clientY - r.top}px`);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
        >
            <div className="dot-grid absolute inset-0 opacity-[0.14]" />
            <div className="dot-grid-hot absolute inset-0" />
        </div>
    );
}
