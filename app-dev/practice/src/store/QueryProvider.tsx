import { PropsWithChildren } from "react";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { DataItem } from "@/types/DataItem";

// 1. Connectivity: tell React Query when we're online
onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((s) =>
        setOnline(!!s.isConnected && s.isInternetReachable !== false),
    ),
);

// 2. Client: long gcTime so cached data survives being persisted
export const Client = new QueryClient({
    defaultOptions: {
        queries: { gcTime: 1000 * 60 * 60 * 24 },
        mutations: { retry: 3 },
    },
});

// 3. Mutation defaults: registered BEFORE the provider mounts,
//    so paused mutations can be replayed after an app restart
Client.setMutationDefaults(["addItem"], {
    mutationFn: (item: DataItem) => api.post("/items", item),
    scope: { id: "items" },
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

export default function QueryProvider({ children }: PropsWithChildren) {
    return (
        <PersistQueryClientProvider
            client={Client}
            persistOptions={{ persister }}
            onSuccess={() =>
                Client.resumePausedMutations().then(() =>
                    Client.invalidateQueries(),
                )
            }
        >
            {children}
        </PersistQueryClientProvider>
    );
}
