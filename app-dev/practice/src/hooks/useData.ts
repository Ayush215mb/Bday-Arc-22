import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/api/fetchData";
import { DataItem } from "@/types/DataItem";

export const useData = <T = DataItem[]>(select?: (items: DataItem[]) => T) =>
    useQuery({
        queryKey: ["data"],
        queryFn: fetchData,
        staleTime: 5000,
        select,
    });
