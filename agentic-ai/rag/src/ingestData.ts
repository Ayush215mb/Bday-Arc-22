import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { readdirSync } from "fs";

async function processPdf(data_path: string) {
    let allDocuments = [];

    const files = readdirSync(data_path, {
        encoding: "utf-8",
        recursive: true,
    });

    const pdf_files = files.filter((file) =>
        file.toLowerCase().endsWith(".pdf"),
    );
    console.log(`${pdf_files.length} PDF files found to process `);

    // console.log(pdf_files);

    for (const pdf of pdf_files) {
        console.log(`processing ${pdf}`);
        try {
            const loader = new PDFLoader(data_path + "/" + pdf);
            const documents = await loader.load();

            //adding custom metadata
            for (const doc of documents) {
                doc.metadata["test"] = "successful";
            }

            console.log(`complete loading ${documents.length} pages `);

            allDocuments.push(...documents);
        } catch (error) {
            console.log(error);
        }
    }

    console.log(`Total ${allDocuments.length} documents loaded `);

    return allDocuments;
}

const documents = await processPdf("./data");

console.log(documents.length);

async function splitDocuemts(
    docuemnts: Document<Record<string, any>>[],
    chunkSize = 1000,
    chunk_overlap = 200,
) {
    const textsplitters = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: chunk_overlap,
        separators: ["\n\n", "\n", " ", ""],
    });
    const splitDocs = await textsplitters.splitDocuments(docuemnts);

    console.log(`Split ${docuemnts.length} into ${splitDocs.length} chunks`);

    return splitDocs;
}

export const chunks = await splitDocuemts(documents);
