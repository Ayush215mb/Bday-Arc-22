import { router } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.Heading}>Hire glevoidd.in</Text>
            <View className="gap-4">
                <TouchableOpacity
                    onPress={() => {
                        router.push("/(screens)/Lists");
                    }}
                    className=""
                >
                    <Text className="text-center text-xl text-neutral-700 font-semibold underline ">
                        Check out how Lists works
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/(screens)/Offline");
                    }}
                    className=""
                >
                    <Text className="text-center text-xl text-neutral-700 font-semibold underline ">
                        Check out how the offline part of an app works
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Heading: {
        fontSize: 26,
        color: "#E09540",
        fontWeight: 700,
        textAlign: "center",
        marginBlock: 16,
    },
});
