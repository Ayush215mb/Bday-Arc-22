import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
    title: {
        default: `${SITE.name} — AI trips that add up`,
        template: `%s · ${SITE.name}`,
    },
    description: SITE.description,
};

export const viewport: Viewport = { themeColor: "#fff3e3" };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen overflow-x-clip antialiased">
                {children}
            </body>
        </html>
    );
}
