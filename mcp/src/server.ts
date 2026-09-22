import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
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
function createUser() {}
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
            const id = "kak";
            return {
                content: [{ type: "text", text: "User created " }],
            };
        } catch {
            return {
                content: [{ type: "text", text: "Failed to create the user" }],
            };
        }
    },
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}

main();
