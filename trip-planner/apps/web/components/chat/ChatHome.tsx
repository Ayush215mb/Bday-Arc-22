"use client";

import { useEffect, useRef, useState } from "react";
import Greeting from "./Greeting";
import SuggestionCards from "./SuggestionCards";
import { VoiceOrb } from "../agents/voice-orb";
import { PromptInput } from "../agents/prompt-input";
import { AnimatePresence, useReducedMotion, motion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";

export default function ChatHome({ userName }: { userName: string }) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState<string>();
    const [notice, setNotice] = useState<string>();
    const timer = useRef<number | undefined>(undefined);
    const reduce = useReducedMotion() ?? false;

    useEffect(
        () => () => {
            if (timer.current) window.clearTimeout(timer.current);
        },
        [],
    );

    const submit = (prompt: string) => {
        setSent(undefined);
        setNotice(undefined);
        setLoading(true);
        timer.current = window.setTimeout(() => {
            setLoading(false);
            setSent(prompt);
        }, 900);
    };
    const stop = () => {
        if (timer.current) window.clearTimeout(timer.current);
        setLoading(false);
    };

    return (
        <section className="my-auto flex w-full max-w-160 flex-col items-center">
            <VoiceOrb />
            <Greeting name={userName} />
            <PromptInput
                className=" bg-[#08080b] shadow-[0_30px_80px_rgba(0,0,0,0.45)]  bg-[radial-gradient(100%_100%_at_50%_20%,rgba(32,128,148,0.55),transparent_100%)]  border-0  "

                loading={loading}
                onSubmit={submit}
                value={prompt}
                onStop={stop}
                onValueChange={setPrompt}
            />
            <div className="h-8 px-2 pt-2 text-xs text-muted-foreground">
                <AnimatePresence mode="wait">
                    {sent || notice ? (
                        <motion.p
                            key={sent ?? notice}
                            initial={
                                reduce ? { opacity: 1 } : { opacity: 0, y: 3 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: reduce ? 0 : 0.18,
                                ease: EASE_OUT,
                            }}
                        >
                            {sent
                                ? "Prompt sent to the selected model."
                                : notice}
                        </motion.p>
                    ) : null}
                </AnimatePresence>
            </div>
            <SuggestionCards onSelect={setPrompt} />
        </section>
    );
}
