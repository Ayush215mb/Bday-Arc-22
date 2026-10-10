import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Client = new QueryClient();

export default function QueryProvider({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={Client}>{children}</QueryClientProvider>
    );
}
