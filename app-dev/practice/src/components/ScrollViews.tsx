import { ScrollView } from "react-native";
import { QueryState } from "./QueryState";
import { DataCard } from "./DataCard";
import { useData } from "@/hooks/useData";

const ScrollViews = () => {
    const { data, isLoading, isError, error } = useData();

    return (
        <QueryState isLoading={isLoading} isError={isError} error={error}>
            <ScrollView>
                {data?.map((item) => (
                    <DataCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </QueryState>
    );
};

export default ScrollViews;
