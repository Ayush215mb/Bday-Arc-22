import { Stack } from "expo-router";
import "../../global.css";
import QueryProvider from "@/store/QueryProvider";

export default function RootLayout() {
    return (
        <QueryProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="Lists" />
            </Stack>
        </QueryProvider>
    );
}
