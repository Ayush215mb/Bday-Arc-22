"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

export function useMouseParallax() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const x = useSpring(mx, { stiffness: 60, damping: 14 });
    const y = useSpring(my, { stiffness: 60, damping: 14 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mx.set(e.clientX / window.innerWidth - 0.5);
            my.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [mx, my]);

    return { x, y };
}
