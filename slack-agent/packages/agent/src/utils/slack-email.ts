import type { WebClient } from "@slack/web-api";

export const getSlackEmails = (slack: WebClient, userIds: string[]) =>
    Promise.all(
        userIds.map(async (id) => {
            const { user } = await slack.users.info({ user: id });
            return {
                id,
                name: user?.real_name ?? user?.name ?? id,
                email: user?.profile?.email,
            };
        }),
    );
