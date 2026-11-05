import { findFamousPlaces } from "../utils/find-famous-places";
import { mapInterestsToGeoapify } from "../utils/categories";

export async function prefetchPlaces(
    destination: string,
    interests: string[],
    apikey: string,
) {
    const perInterest = await Promise.all(
        interests.map(async (interest) => {
            try {
                const { places } = await findFamousPlaces({
                    destination,
                    apiKey: apikey!,
                    categories: mapInterestsToGeoapify([interest]),
                    limit: 5,
                });
                return { interest, places };
            } catch (e) {
                return { interest, places: [], error: String(e) };
            }
        }),
    );

    const hotels = await findFamousPlaces({
        destination,
        apiKey: apikey!,
        categories: ["accommodation.hotel"],
        limit: 6,
    })
        .then((r) => r.places)
        .catch(() => []);

    return { perInterest, hotels };
}
