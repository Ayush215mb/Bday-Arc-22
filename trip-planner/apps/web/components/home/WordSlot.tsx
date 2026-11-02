"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DESTINATIONS } from "@/lib/content";

export function WordSlot() {
    const [i, setI] = useState(0);

    useEffect(() => {
        const t = setInterval(
            () => setI((v) => (v + 1) % DESTINATIONS.length),
            2200,
        );
        return () => clearInterval(t);
    }, []);

    return (
        <span className="relative my-1 inline-block -rotate-2 rounded-2xl border-2 border-ink bg-goji px-4 shadow-hard-lg">
            <span className="relative inline-flex overflow-hidden align-bottom">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={DESTINATIONS[i]}
                        initial={{ y: "100%", rotate: 4 }}
                        animate={{ y: 0, rotate: 0 }}
                        exit={{ y: "-100%", rotate: -4 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block pb-[0.1em]"
                    >
                        {DESTINATIONS[i]}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    );
}
