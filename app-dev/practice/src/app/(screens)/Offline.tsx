import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    useIsMutating,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useNetInfo } from "@react-native-community/netinfo";
import { createPost } from "@/api/postData";

const Offline = () => {
    const { isConnected } = useNetInfo();
    const pending = useIsMutating({ mutationKey: ["addItem"] });
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
        },
    });
    return (
        <SafeAreaView>
            <Text>
                {isConnected
                    ? `Synced`
                    : `Offline, ${pending} change(s) waiting`}
            </Text>
        </SafeAreaView>
    );
};

export default Offline;
