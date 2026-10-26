import { DataItem } from "@/types/DataItem";
import { Text, View } from "react-native";
import { memo } from "react";

export const DataCard = memo(({ item }: { item: DataItem }) => (
    <View
        className={`p-3 my-3 border border-neutral-600 rounded-2xl ${
            item.active ? "bg-green-400" : "bg-red-400"
        }`}
    >
        <Text>{item.id}</Text>
        <Text>{item.value}</Text>
        <Text>{item.active ? "Active" : "Inactive"}</Text>
    </View>
));
