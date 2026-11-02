import type { Metadata } from "next";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const metadata: Metadata = { title: "Plan a trip" };

export default function PlanPage() {
    return <ChatWindow />;
}
