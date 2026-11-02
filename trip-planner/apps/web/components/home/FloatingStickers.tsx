"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { Banknote, MapPin, Route, Sun, type LucideIcon } from "lucide-react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { cn } from "@/lib/cn";

interface StickerData {
    icon: LucideIcon;
    text: string;
    tone: string;
    pos: string;
    depth: number;
    rot: number;
}

const STICKERS: StickerData[] = [
    {
        icon: Sun,
        text: "Sunny · 24°",
        tone: "bg-sun",
        pos: "right-[9%] top-[20%]",
        depth: 36,
        rot: 6,
    },
    {
        icon: MapPin,
        text: "Fushimi Inari",
        tone: "bg-pink",
        pos: "right-[20%] top-[50%]",
        depth: -26,
        rot: -5,
    },
    {
        icon: Banknote,
        text: "Under budget ✓",
        tone: "bg-leaf",
        pos: "right-[7%] bottom-[16%]",
        depth: 22,
        rot: 4,
    },
    {
        icon: Route,
        text: "Day 3 · 5 stops",
        tone: "bg-goji",
        pos: "right-[34%] top-[16%]",
        depth: -34,
        rot: -7,
    },
];

interface StickerProps {
    data: StickerData;
    index: number;
    x: MotionValue<number>;
    y: MotionValue<number>;
}

function Sticker({ data, index, x, y }: StickerProps) {
    const tx = useTransform(x, (v) => v * data.depth);
    const ty = useTransform(y, (v) => v * data.depth);
    const Icon = data.icon;

    return (
        <motion.div
            style={{ x: tx, y: ty }}
            className={cn("absolute", data.pos)}
        >
            <motion.div
                initial={{ scale: 0, rotate: data.rot * 4 }}
                animate={{ scale: 1, rotate: data.rot }}
                transition={{
                    type: "spring",
                    delay: 0.8 + index * 0.15,
                    stiffness: 200,
                    damping: 12,
                }}
            >
                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                        duration: 4 + index,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={cn(
                        "flex items-center gap-2 rounded-2xl border-2 border-ink px-4 py-2.5 font-bold shadow-hard",
                        data.tone,
                    )}
                >
                    <Icon className="size-5" /> {data.text}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export function FloatingStickers() {
    const { x, y } = useMouseParallax();
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
        >
            {STICKERS.map((s, i) => (
                <Sticker key={s.text} data={s} index={i} x={x} y={y} />
            ))}
        </div>
    );
}
