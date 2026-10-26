import { DataItem } from "@/types/DataItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";

const useAddItem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationKey: ["addItem"],
        onMutate: async (item: DataItem) => {
            await qc.cancelQueries({ queryKey: ["items"] });
            qc.setQueryData<DataItem[]>(["items"], (old = []) => [
                ...old,
                { ...item, pending: true },
            ]);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ["items"] }),
    });
};
