import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    children: React.ReactNode;
};

export const QueryState = ({ isLoading, isError, error, children }: Props) => {
    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </SafeAreaView>
        );
    }
    if (isError) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500 font-bold text-lg">ERROR!</Text>
                <Text className="text-red-500">{error?.message}</Text>
            </View>
        );
    }
    return <>{children}</>;
};
