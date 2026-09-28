import { PageIndexClient } from "@pageindex/sdk";
import "dotenv/config";

const PAGE_INDEX_API_KEY = process.env.PAGE_INDEX_API_KEY;
if (!PAGE_INDEX_API_KEY) throw new Error("PAGEINDEX API KEY not found");

export const client = new PageIndexClient({ apiKey: PAGE_INDEX_API_KEY });
