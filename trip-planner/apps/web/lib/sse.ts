export interface SSEEvent {
    event: string;
    data: string;
}

function parseBlock(raw: string): SSEEvent | null {
    let event = "message";
    const data: string[] = [];
    for (const line of raw.split("\n")) {
        if (!line || line.startsWith(":")) continue;
        const i = line.indexOf(":");
        const field = i === -1 ? line : line.slice(0, i);
        let value = i === -1 ? "" : line.slice(i + 1);
        if (value.startsWith(" ")) value = value.slice(1); // spec: strip ONE leading space
        if (field === "event") event = value;
        else if (field === "data") data.push(value);
    }
    return data.length || event !== "message"
        ? { event, data: data.join("\n") }
        : null;
}

export async function* readSSE(
    body: ReadableStream<Uint8Array>,
): AsyncGenerator<SSEEvent> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder
                .decode(value, { stream: true })
                .replace(/\r\n/g, "\n");
            let idx: number;
            while ((idx = buffer.indexOf("\n\n")) !== -1) {
                const evt = parseBlock(buffer.slice(0, idx));
                buffer = buffer.slice(idx + 2);
                if (evt) yield evt;
            }
        }
        const tail = buffer.trim() ? parseBlock(buffer) : null;
        if (tail) yield tail;
    } finally {
        reader.releaseLock();
    }
}
