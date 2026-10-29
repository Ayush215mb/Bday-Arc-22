const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function geocode(place: string) {
    const res = await fetch(
        `${GEO_URL}?name=${encodeURIComponent(place)}&count=1`,
    );
    const data = await res.json();
    const hit = data.results?.[0];
    if (!hit) throw new Error(`Could not find location: ${place}`);
    return {
        lat: hit.latitude,
        lon: hit.longitude,
        name: `${hit.name}, ${hit.country}`,
    };
}
