import { FlatList } from "react-native";
import { QueryState } from "./QueryState";
import { useData } from "@/hooks/useData";
import { DataCard } from "./DataCard";
import { useState } from "react";

const PAGE_SIZE = 25;

const Flatlists = () => {
    const { data, isLoading, isError, error } = useData();
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const items = data ?? [];
    const visible = items.slice(0, visibleCount);

    const loadMore = () => {
        if (visibleCount < items.length) {
            setVisibleCount((c) => c + PAGE_SIZE);
        }
    };
    return (
        <QueryState isLoading={isLoading} isError={isError} error={error}>
            <FlatList
                data={visible}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <DataCard item={item} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
            />
        </QueryState>
    );
};

export default Flatlists;
