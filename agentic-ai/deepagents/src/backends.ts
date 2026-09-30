import {
    createDeepAgent,
    FilesystemBackend,
    StateBackend,
    StoreBackend,
} from "deepagents";
import { InMemoryStore } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

import "dotenv/config";

// const llm = new ChatOllama({
//     model: "qwen2.5:7b-instruct",
//     temperature: 0,
// });
//
const llm = new ChatOpenAI({
    model: "qwen2.5:7b-instruct",
    temperature: 0,
    configuration: {
        baseURL: "http://localhost:11434/v1",
        apiKey: "ollama", // dummy, Ollama ignores it
    },
});

//State Bakcend
const defaultmemoryagent = createDeepAgent({
    model: llm,

    backend: new StateBackend(),
});

const result = await defaultmemoryagent.invoke({
    messages: [
        {
            role: "human",
            content:
                "Create a file at notes/todo.txt with exaclty this content " +
                "1. Record Video\n2. Edit Video\n3. Upload video\n" +
                "Then tell me you've done it",
        },
    ],
});

console.log("Agent reply", result.messages[result.messages.length - 1].content);

// to check if the file has been created or not
// console.log(result.files);

// -------------------------------------------------------------------
// File System backend, the agent stores the file in disk space
const ROOT = ".";
// the agent will save the files in the rootDir passed by us
const FilesystemAgent = createDeepAgent({
    model: llm,
    backend: new FilesystemBackend({ rootDir: ROOT, virtualMode: true }),
});

const result2 = await FilesystemAgent.invoke({
    messages: [
        {
            role: "human",
            content:
                "Create a file at tests/todo.txt with exaclty this content " +
                "1. Record Video\n2. Edit Video\n3. Upload video\n" +
                "Then tell me you've done it",
        },
    ],
});

console.log(
    "FilesystemAgent reply",
    result2.messages[result2.messages.length - 1].content,
);

// -------------------------------------------------------------------------

// the file is not saved in disk at all, it is stored inside RAM, lives inside InMemoryStore object
const store = new InMemoryStore();

//StoreBackend stores files in a LangGraph BaseStore provided by the runtime, enabling cross‑thread durable storage.

const StoreBackendAgent = createDeepAgent({
    model: llm,
    backend: new StoreBackend({
        //from docs
        // namespace: (rt) => [rt.serverInfo.user.identity],
        namespace: ["demo-user"],
    }),
    store: store,
});

const config = { configurable: { thread_id: "todo-session-1" } };
const config2 = { configurable: { thread_id: "todo-session-2" } };

const storeresult = await StoreBackendAgent.invoke(
    {
        messages: [
            {
                role: "human",
                content: `Create a file at "/notes/todo.txt" with exactly this content
                    1. Record Video\n2. Edit Video\n3. Upload video\n
                    Then tell me you've done it`,
            },
        ],
    },
    config,
);

console.log(
    "StoreAgent reply from thread 1",
    storeresult.messages.at(-1).content,
);

const followup = await StoreBackendAgent.invoke(
    {
        messages: [
            {
                role: "human",
                content: `Read the "/notes/todo.txt" and tell how can i imporve it`,
            },
        ],
    },
    config2,
);

console.log("StoreAgent reply from thread 2", followup.messages.at(-1).content);

// to check if the store is actually being written or not
// const entries = await store.search(["demo-user"]);
// console.log("Store contents:", entries);

/*
there is a problem in the path mismatch while calling the tools directly

"tool_calls": [
        {
          "name": "write_file",
          "args": {
            "file_path": "notes/todo.txt",
            "content": "1. Record Video\n2. Edit Video\n3. Upload video\n"
          },
          "type": "tool_call",
          "id": "call_9it8kd3e"
        }
      ],

"tool_calls": [
        {
          "name": "read_file",
          "args": {
            "file_path": "/notes/todo.txt"
          },
          "type": "tool_call",
          "id": "call_tif37bz7"
        }
      ],

SOLUTION: Using "/notes/todo.txt" and "/notes/todo.txt" explicitly inside quotation in both invocation helps the agent to understand the path better
*/
