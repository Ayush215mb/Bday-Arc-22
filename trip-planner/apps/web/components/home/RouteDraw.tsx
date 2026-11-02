"use client";

import { motion } from "motion/react";

const PATH = "M-20 430 C 180 250, 330 520, 560 330 S 900 120, 1220 260";

export function RouteDraw() {
    return (
        <svg
            aria-hidden
            viewBox="0 0 1200 500"
            preserveAspectRatio="xMidYMax slice"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] w-full"
        >
            <path
                id="route"
                d={PATH}
                fill="none"
                stroke="#1c0b10"
                strokeOpacity={0.35}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray="1 14"
            />
            <motion.path
                d={PATH}
                fill="none"
                stroke="#ff3b2f"
                strokeWidth={5}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.6, delay: 0.6, ease: "easeInOut" }}
            />
            <g>
                <animateMotion
                    dur="7s"
                    begin="1s"
                    repeatCount="indefinite"
                    rotate="auto"
                >
                    <mpath href="#route" />
                </animateMotion>
                <polygon
                    points="-12,-10 18,0 -12,10 -5,0"
                    style={{
                        fill: "#ffc82e",
                        stroke: "#1c0b10",
                        strokeWidth: 2.5,
                        strokeLinejoin: "round",
                    }}
                />
            </g>
        </svg>
    );
}
