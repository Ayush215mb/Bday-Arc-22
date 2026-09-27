import { Document } from "@langchain/core/documents";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import {
    JSONLoader,
    JSONLinesLoader,
} from "@langchain/classic/document_loaders/fs/json";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

//docuemnt
const doc = new Document({
    pageContent: "This is the main content",
    id: "01",
    metadata: {
        source: "Example.com",
        pages: 200,
        author: "Ayush215mb",
        date_created: "2026-09-27",
    },
});

// console.log(doc)

// Text loader
const loader = new TextLoader("./data/ml.txt");

// console.log(await loader.load());

// Directory loader
const dir_loader = new DirectoryLoader("./data", {
    ".json": (path) => new JSONLoader(path),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
});

console.log(await dir_loader.load());
