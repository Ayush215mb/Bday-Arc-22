export const DEFAULT_GEOAPIFY_CATEGORIES = [
    "tourism.attraction",
    "tourism.sights",
    "entertainment.culture",
    "leisure.park",
];

const INTEREST_MAP: Record<string, string[]> = {
    food: ["catering.restaurant", "catering.cafe", "catering.fast_food"],
    restaurants: ["catering.restaurant"],
    cafe: ["catering.cafe"],
    coffee: ["catering.cafe"],
    nightlife: ["adult.nightclub", "catering.bar", "entertainment"],
    bars: ["catering.bar", "catering.pub"],
    temples: ["tourism.sights", "religion.place_of_worship"],
    temple: ["tourism.sights", "religion.place_of_worship"],
    church: ["religion.place_of_worship"],
    mosque: ["religion.place_of_worship"],
    culture: ["entertainment.culture", "tourism.sights"],
    museum: ["entertainment.museum", "entertainment.culture"],
    museums: ["entertainment.museum", "entertainment.culture"],
    art: ["entertainment.culture", "tourism.sights"],
    history: ["tourism.sights", "entertainment.museum"],
    nature: ["natural", "leisure.park"],
    parks: ["leisure.park"],
    park: ["leisure.park"],
    hiking: ["natural", "leisure.park"],
    beach: ["beach", "natural.water"],
    beaches: ["beach", "natural.water"],
    shopping: ["commercial.shopping_mall", "commercial"],
    markets: ["commercial.marketplace", "commercial"],
    sports: ["sport", "entertainment"],
    adventure: ["sport", "tourism.attraction"],
    kids: ["entertainment", "leisure.playground"],
    family: ["entertainment", "leisure.park", "tourism.attraction"],
    nightlife_events: ["entertainment", "adult.nightclub"],
    events: ["entertainment"],
    shows: ["entertainment"],
    music: ["entertainment"],
    live: ["entertainment"],
    attractions: ["tourism.attraction", "tourism.sights"],
    sightseeing: ["tourism.sights", "tourism.attraction"],
    landmarks: ["tourism.sights", "tourism.attraction"],
};

const EVENT_HINTS = [
    "event",
    "events",
    "show",
    "shows",
    "concert",
    "live",
    "festival",
    "sports",
    "match",
    "nightlife",
];

export function mapInterestsToGeoapify(interests: string[]): string[] {
    if (!interests.length) return [...DEFAULT_GEOAPIFY_CATEGORIES];

    const mapped = new Set<string>();
    for (const raw of interests) {
        const key = raw.trim().toLowerCase();
        const hit = INTEREST_MAP[key];
        if (hit) {
            for (const c of hit) mapped.add(c);
            continue;
        }

        for (const [alias, cats] of Object.entries(INTEREST_MAP)) {
            if (key.includes(alias)) {
                for (const c of cats) mapped.add(c);
            }
        }
    }

    return mapped.size ? [...mapped] : [...DEFAULT_GEOAPIFY_CATEGORIES];
}

export function interestsNeedLiveSearch(interests: string[]): boolean {
    return interests.some((i) => {
        const key = i.trim().toLowerCase();
        return EVENT_HINTS.some((h) => key.includes(h));
    });
}
