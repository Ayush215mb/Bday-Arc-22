import { client } from "./client";

const doc_id = process.env.DOC_ID;

const doc = await client.api.getDocument(doc_id);
console.log(`Document: ${doc.name}`);
console.log(`Status: ${doc.status}`);
console.log(`Pages: ${doc.pageNum}`);

const response = await client.api.chatCompletions({
    messages: [
        {
            role: "user",
            content: "What are the key findings in this document?",
        },
    ],
    doc_id: doc_id,
});

console.log(response.choices[0].message.content);
