import { geocode } from "../utils/geocode";

const BASE = "https://api.opentripmap.com/0.1/en/places";

export interface Place {
    name: string;
    kinds: string;
    rating: number;
    distanceM: number;
}

export async function findFamousPlaces(
    city: string,
    apikey: string,
    limit = 10,
    radiusM = 15000,
): Promise<{ location: string; places: Place[] }> {
    const { lat, lon, name } = await geocode(city);

    const res = await fetch(
        `${BASE}/radius?radius=${radiusM}&lon=${lon}&lat=${lat}` +
            `&rate=3&kinds=interesting_places&limit=${limit * 3}&format=json&apikey=${apikey}`,
    );
    if (!res.ok) throw new Error(`Places API failed: ${res.status}`);

    const items = (await res.json()) as {
        name: string;
        kinds: string;
        rate: number;
        dist: number;
    }[];

    const places = items
        .filter((p) => p.name?.trim())
        .sort((a, b) => b.rate - a.rate || a.dist - b.dist)
        .slice(0, limit)
        .map((p) => ({
            name: p.name,
            kinds: p.kinds.split(",").slice(0, 3).join(", "),
            rating: p.rate,
            distanceM: Math.round(p.dist),
        }));

    return { location: name, places };
}
