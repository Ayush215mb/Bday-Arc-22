"use server";

import { chunkContent } from "@/lib/chunking";
import { db } from "@/lib/db-config";
import { documents } from "@/lib/db-schema";
import { generateEmbeddings } from "@/lib/embedding";
import { PDFParse } from "pdf-parse";

export async function processPdfFile(formData: FormData) {
    try {
        const file = formData.get("pdf") as File;

        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes); // was: Buffer.from(bytes)
        const data = new PDFParse(buffer);

        const { text } = await data.getText();

        if (!text || text.trim().length === 0) {
            return {
                sucess: false,
                error: "no text found in pdf",
            };
        }

        const chunks = await chunkContent(text);

        const embeddings = await generateEmbeddings(chunks);

        const records = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index],
        }));

        await db.insert(documents).values(records);

        return {
            success: true,
            message: `created ${records.length} searchable chunks `,
        };
    } catch (error) {
        console.error("PDF processing erro r", error);
        return {
            success: false,
            error: "Failed to process pdf",
        };
    }
}
