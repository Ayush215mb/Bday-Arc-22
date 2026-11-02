"use client";

import { motion } from "motion/react";

interface Props {
    text: string;
    delay?: number;
    className?: string;
}

export function SplitWords({ text, delay = 0, className }: Props) {
    return (
        <span className={className} aria-label={text}>
            {text.split(" ").map((word, i) => (
                <span
                    key={i}
                    aria-hidden
                    className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                >
                    <motion.span
                        className="inline-block"
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: delay + i * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {word}
                        {"\u00A0"}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
