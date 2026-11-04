import type { ReactNode } from "react";
import UserAvatar from "./UserAvatar";

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className=" min-h-screen w-full bg-[radial-gradient(120%_70%_at_50%_100%,#2b8696_0%,#2b3a40_45%,#2b2b2d_75%)]">
            <div className="relative flex min-h-screen w-full overflow-hidden border border-white/10 bg-[#08080b] shadow-[0_30px_80px_rgba(0,0,0,0.45)] ">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(70%_100%_at_50%_100%,rgba(32,128,148,0.55),transparent_70%)]"
                />

                <main className="relative z-10 flex min-w-0 flex-1 flex-col items-center overflow-y-auto px-4 py-8">
                    <div className="flex w-full justify-end px-4">
                        <UserAvatar name="Ayush" />
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
