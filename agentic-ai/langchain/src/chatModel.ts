import { initChatModel } from "langchain";
import { ChatOllama } from "@langchain/ollama";
import { SystemMessage, HumanMessage } from "langchain";

const model = new ChatOllama({
    model: "qwen3.5:9b",
    numCtx: 25000,
    temperature: 0.6,
    maxRetries: 8,
    think: false, //for faster response
    keepAlive: "15m",
});
// const model = await initChatModel("ollama:qwen3.5:9b");

// invoke
// const response = await model.invoke("who r u?");

// streaming
const stream = await model.stream(
    "explain the phenomena of rainbows in 50 words ",
);

// to stream everything
// for await (const chunk of stream) {
//     for (const block of chunk.contentBlocks) {
//         if (block.type === "reasoning") {
//             console.log(`Reasoning: ${block.reasoning}`);
//         } else if (block.type === "tool_call_chunk") {
//             console.log(`Tool call chunk: ${block}`);
//         } else if (block.type === "text") {
//             console.log(block.text);
//         } else {
//             console.log("something went wrong");
//         }
//     }
// }

//to stream only the response
for await (const chunk of stream) {
    console.log(chunk.text);
}

// Batching

const batchInputs = [
    [
        new SystemMessage(
            "You are a smart assistant who give fast replies without thinking too much and reply in 30-40 words to save the user some time",
        ),
        new HumanMessage("Why do parrots have colorful feathers?"),
    ],
    [
        new SystemMessage(
            "You are a stupid assistant who give fast replies without thinking too much and reply in 30-40 words to save the user some time",
        ),
        new HumanMessage("What is quantum computing?"),
    ],
    [
        new SystemMessage("You are a Computer science teacher at stanford"),
        new HumanMessage("explain what is llm in 50 words"),
    ],
    [
        new SystemMessage("You are a poet"),
        new HumanMessage("write a poem for my wife in 8 lines"),
    ],
];

const responses = await model.batch(batchInputs, {
    maxConcurrency: 5,
});
for (const response of responses) {
    console.log(response);
}
