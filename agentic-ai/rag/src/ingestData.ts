import { Document } from "@langchain/core/documents";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import {
    JSONLoader,
    JSONLinesLoader,
} from "@langchain/classic/document_loaders/fs/json";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
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

            allDocuments.push(documents);
        } catch (error) {
            console.log(error);
        }
    }

    console.log(`Total ${allDocuments.length} documents loaded `);

    return allDocuments;
}

await processPdf("./data");
