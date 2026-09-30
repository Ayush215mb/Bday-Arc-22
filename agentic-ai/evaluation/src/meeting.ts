import { ChatOllama } from "@langchain/ollama";
import { traceable } from "langsmith/traceable";
import { wrapSDK } from "langsmith/wrappers";
import { Client } from "langsmith";
import { evaluate } from "langsmith/evaluation";
import "dotenv/config";

const client = new Client({
    apiKey: process.env.LANGSMITH_API_KEY,
});

const datasetName = "meeting-summary-eval";

const dataset = (await client.hasDataset({ datasetName }))
    ? await client.readDataset({ datasetName })
    : await client.createDataset(datasetName, {
          description: "Ground truth for the meeting assistant",
      });
//3401489d-dc5f-45c8-85fa-40e185005c11
//
console.log(dataset);
client.createExample({
    dataset_id: dataset.id,
    inputs: {
        question: "Can you summarize this morning's meetings?",
    },
    outputs: { answer: "nothing was done" },
});

const llm = wrapSDK(
    new ChatOllama({
        model: "qwen3.5:9b",
        numCtx: 25000,
        temperature: 0.6,
        maxRetries: 8,
        think: false, //for faster response
        keepAlive: "15m",
    }),
);

const tool = traceable(
    (question: string) => {
        return "During this morning's meeting, we solved all world conflict.";
    },
    { name: "Retrieve Context", run_type: "tool" },
);

const assistant = traceable(
    async function assistant(question: string) {
        // capture the full pipeline as a single trace
        const context = await tool(question);
        const response = await llm.invoke([
            {
                role: "system",
                content: `Answer using the context below.\n\nContext: ${context}`,
            },
            { role: "user", content: question },
        ]);
        return response.text ?? null;
    },
    {
        name: "Meeting",
        client,
        tracingEnabled: true, //used for conditional tracing
    },
);

// (async () => {
//     console.log(await assistant("Can you summarize this morning's meetings?"));
// })();

const containsReference = ({ outputs, referenceOutputs }: any) => ({
    key: "contains_reference",
    score: outputs.answer.toLowerCase().includes("world conflict") ? 1 : 0,
});

const result = await evaluate(
    async (input: { question: string }) => ({
        answer: await assistant(input.question),
    }),
    {
        data: datasetName,
        evaluators: [containsReference],
        experimentPrefix: "meeting-v1",
        client,
    },
);
for await (const row of result) {
    console.log(
        row.example.inputs,
        row.run.outputs,
        row.evaluationResults.results,
    );
}
