import Flatlists from "@/components/Flatlists";
import ScrollViews from "@/components/ScrollViews";
import SectionLists from "@/components/SectionLists";
import VirtualizedLists from "@/components/VirtualizedLists";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LISTS = [
    { key: "flat", label: "Flat list", Component: Flatlists },
    { key: "scroll", label: "Scroll View", Component: ScrollViews },
    { key: "section", label: "Section List", Component: SectionLists },
    {
        key: "virtualized",
        label: "Virtualized List",
        Component: VirtualizedLists,
    },
] as const;

type ListKey = (typeof LISTS)[number]["key"];

type TabProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
};

const Tab = ({ label, selected, onPress }: TabProps) => (
    <TouchableOpacity onPress={onPress}>
        <View
            className={`border rounded-4xl px-4 py-2 ${
                selected ? "border-blue-400 bg-blue-50" : "border-neutral-400"
            }`}
        >
            <Text className="text-sm text-black font-semibold">{label}</Text>
        </View>
    </TouchableOpacity>
);
export default function Lists() {
    const [activeKey, setActiveKey] = useState<ListKey>("flat");
    const ActiveList = LISTS.find((l) => l.key === activeKey)!.Component;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text className="text-2xl font-bold text-blue-400 text-center">
                Different kind of lists
            </Text>

            <ScrollView
                className="m-4 grow-0"
                contentContainerClassName="gap-4"
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {LISTS.map(({ key, label }) => (
                    <Tab
                        key={key}
                        label={label}
                        selected={key === activeKey}
                        onPress={() => setActiveKey(key)}
                    />
                ))}
            </ScrollView>

            <View className="px-2 flex-1">
                <ActiveList />
            </View>
        </SafeAreaView>
    );
}
