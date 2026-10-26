import { VirtualizedList } from "react-native";
import { useData } from "@/hooks/useData";
import { QueryState } from "@/components/QueryState";
import { DataCard } from "@/components/DataCard";
import type { DataItem } from "@/types/DataItem";

const getItem = (data: DataItem[], index: number) => data[index];
const getItemCount = (data: DataItem[]) => data.length;
const keyExtractor = (item: DataItem) => item.id.toString();

const VirtualizedLists = () => {
    const { data, isLoading, isError, error } = useData();

    return (
        <QueryState isLoading={isLoading} isError={isError} error={error}>
            <VirtualizedList<DataItem>
                data={data ?? []}
                initialNumToRender={4}
                keyExtractor={keyExtractor}
                getItem={getItem}
                getItemCount={getItemCount}
                renderItem={({ item }) => <DataCard item={item} />}
            />
        </QueryState>
    );
};

export default VirtualizedLists;
