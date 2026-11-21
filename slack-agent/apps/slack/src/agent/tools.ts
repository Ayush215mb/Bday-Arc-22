import { postSlackMessageTool } from "@slack-agent/agent";
import { WebClient } from "@slack/web-api";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SLACK_BOT_TOKEN) throw new Error("SLACK_BOT_TOKEN not found");
const slack = new WebClient(SLACK_BOT_TOKEN);

export const tools = {
    createpostSlackMessageTool: postSlackMessageTool(slack),
};
