import Image from "next/image";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { DEV } from "@/lib/dev-content";
import { SocialLinks } from "./SocialLinks";

export function DevCard() {
    return (
        <section className="relative z-10 grid items-center gap-10 md:grid-cols-[auto_1fr]">
            <Reveal>
                <div className="relative w-fit">
                    <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-[2rem] border-2 border-ink bg-goji" />
                    <Image
                        src={DEV.avatar}
                        alt={DEV.name}
                        width={224}
                        height={224}
                        priority
                        className="relative size-56 -rotate-2 rounded-[2rem] border-2 border-ink object-cover"
                    />
                    <span className="absolute -bottom-4 -left-4 -rotate-6 rounded-full border-2 border-ink bg-sun px-3 py-1 text-sm font-black shadow-hard">
                        hello, world
                    </span>
                </div>
            </Reveal>

            <Reveal delay={0.1}>
                <p className="font-bold text-goji">{DEV.handle}</p>
                <h1 className="font-display text-6xl font-black leading-[0.95] sm:text-8xl">
                    Ayush
                    <br />
                    Yadav
                </h1>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-leaf px-4 py-1.5 text-sm font-bold">
                    {DEV.role} <span className="opacity-40">·</span>{" "}
                    <MapPin className="size-4" /> {DEV.location}
                </p>
                <p className="mt-5 font-display text-2xl font-bold">
                    {DEV.tagline}
                </p>
                <p className="mt-2 max-w-xl text-ink/75">{DEV.bio}</p>
                <div className="mt-6">
                    <SocialLinks />
                </div>
            </Reveal>
        </section>
    );
}
