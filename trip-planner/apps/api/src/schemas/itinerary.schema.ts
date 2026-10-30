import z from "zod";

export const itinarySchema = z.object({
    days: z.string().describe("eg. day 0, day 1 and so forth"),
    activities: z.string().describe("activity planned for that day"),
    cost: z.string().describe("the cost of that activity"),
    location: z.string().describe("the location of the activity"),
    time: z.string().describe("time allotted for the activity"),
});
