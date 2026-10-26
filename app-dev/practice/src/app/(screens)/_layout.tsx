import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ScreensLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Lists" />
            <Stack.Screen name="Offline" />
        </Stack>
    );
};

export default ScreensLayout;
