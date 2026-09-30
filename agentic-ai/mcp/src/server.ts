import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import fs from "node:fs/promises";
import { z } from "zod";

const server = new McpServer(
    {
        name: "testing",
        version: "1.0",
    },
    {
        capabilities: {
            tools: {},
            resources: {},
            prompts: {},
        },
    },
);

server.registerTool(
    "Create a user",
    {
        title: "Create a user",
        description: "Create a user in the database",
        inputSchema: z.object({
            name: z.string(),
            email: z.email(),
            country: z.string(),
        }),
        annotations: {
            title: "Create user",
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    },
    async ({ name, email, country }) => {
        try {
            const id = await createUser({ name, email, country });
            return {
                content: [
                    { type: "text", text: `User ${id} created succesfully` },
                ],
            };
        } catch {
            return {
                content: [{ type: "text", text: "Failed to create the user" }],
            };
        }
    },
);

async function createUser(user: {
    name: string;
    email: string;
    country: string;
}) {
    const users = await import("./data/users.json", {
        with: { type: "json" },
    }).then((m) => m.default);

    const id = users.length + 1;

    users.push({ id, ...user });

    await fs.writeFile("./src/data/users.json", JSON.stringify(users, null, 2));

    return id;
}
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}

main();
