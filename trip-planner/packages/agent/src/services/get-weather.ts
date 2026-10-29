import { geocode } from "../utils/geocode";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

const DAILY = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "precipitation_probability_max",
].join(",");

export const getWeather = async ({
    location,
    startDate,
    endDate,
}: {
    location: string;
    startDate: string;
    endDate: string;
}) => {
    const { lat, lon, name } = await geocode(location);

    const daysAhead = (new Date(startDate).getTime() - Date.now()) / 86_400_000;
    const inForecastRange = daysAhead <= 15; // forecast covers ~16 days

    let url: string;
    if (inForecastRange) {
        url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=${DAILY}&start_date=${startDate}&end_date=${endDate}&timezone=auto`;
    } else {
        // Too far out: use the same dates last year as a "typical weather" proxy
        const shift = (d: string) => {
            const x = new Date(d);
            x.setFullYear(x.getFullYear() - 1);
            return x.toISOString().slice(0, 10);
        };
        url = `${ARCHIVE_URL}?latitude=${lat}&longitude=${lon}&daily=${DAILY.replace(",precipitation_probability_max", "")}&start_date=${shift(startDate)}&end_date=${shift(endDate)}&timezone=auto`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();

    return JSON.stringify({
        location: name,
        type: inForecastRange
            ? "forecast"
            : "historical (same dates last year, approximate)",
        daily: data.daily,
    });
};
