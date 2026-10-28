import "dotenv/config";
export async function convertCurrency(
    amount: number,
    from: string,
    to: string,
) {
    const url = `https://api.frankfurter.dev/v2/rates?base=${from}&quotes=${to}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Rate lookup failed: ${res.status}`);
    const data = (await res.json()) as {
        date: string;
        base: string;
        quote: string;
        rate: number;
    }[];
    const rate = data[0]?.rate;
    if (rate === undefined) {
        throw new Error(`No rate found for ${from} -> ${to}`);
    }
    return { rate, converted: Number((amount * rate).toFixed(2)) };
}
