import { readFileSync } from "fs";
import { client } from "./client";

// 1. Upload a document
const file = readFileSync("./4th_Sem_Syllabus.pdf");
const { doc_id } = await client.api.submitDocument(
    file,
    "4th_Sem_Syllabus.pdf",
);
console.log("Document ID:", doc_id);

// 2. Get tree structure (includes processing status)
const tree = await client.api.getTree(doc_id);
if (tree.status === "completed") {
    console.log("Tree:", tree.result);
}
