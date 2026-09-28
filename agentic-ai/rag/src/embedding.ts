import { ChromaClient, CloudClient } from "chromadb";
import { pipeline } from "@huggingface/transformers";
import { createHash } from "crypto";
import { chunks } from "./data-loader";

const client = new ChromaClient();

const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
);

export async function embed(texts: string[]): Promise<number[][]> {
    const out = await extractor(texts, { pooling: "mean", normalize: true });
    return out.tolist();
}

const collection = await client.getOrCreateCollection({
    name: "pdf-data",
});

const BATCH = 32;
for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const embeddings = await embed(batch.map((c) => c.pageContent));

    await collection.upsert({
        ids: batch.map((c) =>
            createHash("sha1")
                .update(c.metadata.source + c.pageContent)
                .digest("hex"),
        ),
        embeddings,
        documents: batch.map((c) => c.pageContent),
        metadatas: batch.map((c) => ({
            source: c.metadata.source,
            page: c.metadata.loc?.pageNumber ?? -1,
        })),
    });
}

export async function retriever(query: string, top_k: number) {
    const [q] = await embed([query]);
    const res = await collection.query({
        queryEmbeddings: [q],
        nResults: top_k,
        include: ["documents", "metadatas", "distances"],
    });
    return res.documents[0].map((text, i) => ({
        text: text ?? "",
        metadata: res.metadatas[0][i],
        distance: res.distances?.[0][i],
    }));
}
