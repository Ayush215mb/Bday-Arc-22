import { PageIndexError } from "@pageindex/sdk";
import { client } from "./client";

export async function retrieveFromPageIndex(
    query: string,
    docId: string,
): Promise<string> {
    try {
        const res = await client.api.chatCompletions({
            messages: [{ role: "user", content: query }],
            doc_id: docId,
        });
        return res.choices[0]?.message?.content ?? "";
    } catch (err) {
        if (err instanceof PageIndexError) {
            console.error(err.code, err.message);
            return "";
        }
        throw err;
    }
}
