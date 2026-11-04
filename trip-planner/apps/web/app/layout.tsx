import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: {
        default: `PlanmyTrip — AI trips that add up`,
        template: `%s · PlanmyTrip`,
    },
    description: "PlanmyTrip",
};
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});
export const viewport: Viewport = { themeColor: "#fff3e3" };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
            <body
                className={`${jakarta.className} min-h-full w-full bg-[#2b2c2e] text-white antialiased `}
            >
                {children}
            </body>
        </html>
    );
}
