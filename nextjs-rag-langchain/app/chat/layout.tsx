export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div suppressHydrationWarning className="my-auto ">
            {children}
        </div>
    );
}
