import {
    postSlackMessageTool,
    findSlackUserTool,
    createChannelTool,
    listChannelsTool,
    sendDirectMessageTool,
    getTeamStatusTool,
    getChannelMembersTool,
    getConversationTranscriptTool,
    postMeetingMinutesTool,
    scheduleSlackMessageTool,
    inviteToChannelTool,
    searchSlackMessagesTool,
    getCalendarEventsTool,
    findFreeSlotsTool,
    scheduleMeetingTool,
} from "@slack-agent/agent/tools";

import { WebClient } from "@slack/web-api";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SLACK_BOT_TOKEN) throw new Error("SLACK_BOT_TOKEN not found");
const slack = new WebClient(SLACK_BOT_TOKEN);

export const tools = {
    createpostSlackMessageTool: postSlackMessageTool(slack),
    findSlackUserTool: findSlackUserTool(slack),
    createChannelTool: createChannelTool(slack),
    listChannelsTool: listChannelsTool(slack),
    sendDirectMessageTool: sendDirectMessageTool(slack),
    getTeamStatusTool: getTeamStatusTool(slack),
    getChannelMembersTool: getChannelMembersTool(slack),
    getConversationTranscriptTool: getConversationTranscriptTool(slack),
    postMeetingMinutesTool: postMeetingMinutesTool(slack),
    scheduleSlackMessageTool: scheduleSlackMessageTool(slack),
    inviteToChannelTool: inviteToChannelTool(slack),
    searchSlackMessagesTool: searchSlackMessagesTool(slack),
    // getCalendarEventsTool: getCalendarEventsTool(slack),
    // findFreeSlotsTool:findFreeSlotsTool(slack)
};
