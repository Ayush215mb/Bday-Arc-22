import { geocode } from "../utils/geocode";

const BASE = "https://api.geoapify.com/v2/places";

export interface Place {
    name: string;
    categories: string;
    distanceM: number;
}

interface GeoapifyFeature {
    properties: {
        name?: string;
        categories?: string[];
        distance?: number;
    };
}
export const DEFAULT_CATEGORIES = [
    "tourism.attraction",
    "tourism.sights",
    "entertainment.culture",
    "leisure.park",
];
interface FindPlacesOptions {
    destination: string;
    apiKey: string;
    categories?: string[];
    limit?: number;
    radiusM?: number;
}
export async function findFamousPlaces({
    destination,
    apiKey,
    categories = DEFAULT_CATEGORIES,
    limit = 10,
    radiusM = 15000,
}: FindPlacesOptions): Promise<{ location: string; places: Place[] }> {
    const { lat, lon, name } = await geocode(destination);
    if (!apiKey) throw new Error("GEOAPIFY_API_KEY is missing");
    const params = new URLSearchParams({
        categories: categories.join(","),
        filter: `circle:${lon},${lat},${radiusM}`,
        bias: `proximity:${lon},${lat}`,
        limit: String(limit * 2),
        apiKey,
    });

    const res = await fetch(`${BASE}?${params}`, {
        method: "GET",
        redirect: "follow",
    });

    if (!res.ok) throw new Error(`Places API failed: ${res.status}`);

    const data = (await res.json()) as { features: GeoapifyFeature[] };

    const places = data.features
        .map((f) => f.properties)
        .filter((p) => p.name?.trim())
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        .slice(0, limit)
        .map((p) => ({
            name: p.name!,
            categories: (p.categories ?? []).slice(0, 3).join(", "),
            distanceM: Math.round(p.distance ?? 0),
        }));

    return { location: name, places };
}
