import AppShell from "@/components/layout/AppShell";
import ChatHome from "@/components/chat/ChatHome";

export default function Homepage() {
    return (
        <AppShell>
            <ChatHome userName="Master" />
        </AppShell>
    );
}
