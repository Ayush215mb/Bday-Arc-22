import { SectionList, Text } from "react-native";
import { useData } from "@/hooks/useData";
import { DataItem } from "@/types/DataItem";
import { DataCard } from "./DataCard";
import { QueryState } from "./QueryState";

const SectionLists = () => {
    const selectSections = (items: DataItem[]) => [
        { title: "Active", data: items.filter((i) => i.active) },
        { title: "Inactive", data: items.filter((i) => !i.active) },
    ];

    const { data, isLoading, isError, error } = useData(selectSections);

    return (
        <QueryState isLoading={isLoading} isError={isError} error={error}>
            <SectionList
                sections={data ?? []}
                keyExtractor={(item) => String(item.id)}
                renderSectionHeader={({ section: { title } }) => (
                    <Text className="font-bold text-lg">{title}</Text>
                )}
                renderItem={({ item }) => (
                    <DataCard key={item.id} item={item} />
                )}
            />
        </QueryState>
    );
};

export default SectionLists;
