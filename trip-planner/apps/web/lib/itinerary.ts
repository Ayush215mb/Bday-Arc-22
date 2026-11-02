import type { Activity, Itinerary, ItineraryDay } from "./types";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj =>
    typeof v === "object" && v !== null && !Array.isArray(v);
const pick = (o: unknown, keys: string[]): unknown =>
    isObj(o) ? keys.map((k) => o[k]).find((v) => v != null) : undefined;
const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim()
        ? v
        : typeof v === "number"
          ? String(v)
          : undefined;

function cost(v: unknown): string | number | undefined {
    if (typeof v === "number" || typeof v === "string") return v;
    const amount = pick(v, ["amount", "value", "total"]);
    return typeof amount === "number" || typeof amount === "string"
        ? amount
        : undefined;
}

function toActivity(a: unknown): Activity | null {
    if (typeof a === "string") return { name: a };
    const name = str(pick(a, ["name", "title", "activity", "place"]));
    if (!name) return null;
    return {
        name,
        time: str(pick(a, ["time", "startTime", "start_time", "slot"])),
        description: str(pick(a, ["description", "details", "notes"])),
        location: str(pick(a, ["location", "address", "area"])),
        cost: cost(
            pick(a, ["cost", "price", "estimatedCost", "estimated_cost"]),
        ),
    };
}

function toDay(d: unknown, i: number): ItineraryDay {
    const list = pick(d, ["activities", "items", "stops", "events"]);
    return {
        day: Number(pick(d, ["day", "dayNumber", "day_number"])) || i + 1,
        title: str(pick(d, ["title", "theme", "name", "label"])),
        activities: Array.isArray(list)
            ? list.map(toActivity).filter((a): a is Activity => a !== null)
            : [],
    };
}

function normalize(data: unknown): Itinerary | null {
    const nested = pick(data, ["itinerary"]);
    const root = isObj(nested) ? nested : data;
    const days = pick(root, ["days", "itinerary", "plan", "schedule"]);
    if (!Array.isArray(days) || days.length === 0) return null;
    return {
        destination:
            str(pick(root, ["destination", "city", "location"])) ?? "Your trip",
        summary: str(pick(root, ["summary", "overview", "description"])),
        totalCost: cost(
            pick(root, [
                "totalCost",
                "total_cost",
                "cost",
                "estimatedCost",
                "budget",
            ]),
        ),
        currency: str(pick(root, ["currency"])),
        days: days.map(toDay),
    };
}

function extractJson(text: string): string | null {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const body = (fenced ? fenced[1] : text).trim();
    const start = body.indexOf("{");
    const end = body.lastIndexOf("}");
    return start !== -1 && end > start ? body.slice(start, end + 1) : null;
}

export function parseItinerary(text: string): Itinerary | null {
    const raw = extractJson(text);
    if (!raw) return null;
    try {
        return normalize(JSON.parse(raw));
    } catch {
        return null;
    }
}

export function formatCost(
    value?: string | number,
    currency?: string,
): string | null {
    if (value === undefined) return null;
    return typeof value === "number"
        ? `${currency ?? ""} ${value.toLocaleString()}`.trim()
        : value;
}
