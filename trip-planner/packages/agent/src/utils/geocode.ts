import { z } from "zod";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

const GeoResponse = z.object({
    results: z
        .array(
            z.object({
                latitude: z.number(),
                longitude: z.number(),
                name: z.string(),
                country: z.string().optional(),
            }),
        )
        .optional(),
});

export async function geocode(place: string) {
    const res = await fetch(
        `${GEO_URL}?name=${encodeURIComponent(place)}&count=1`,
    );
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

    const data = GeoResponse.parse(await res.json());
    const hit = data.results?.[0];
    if (!hit) throw new Error(`Could not find location: ${place}`);

    return {
        lat: hit.latitude,
        lon: hit.longitude,
        name: [hit.name, hit.country].filter(Boolean).join(", "),
    };
}
