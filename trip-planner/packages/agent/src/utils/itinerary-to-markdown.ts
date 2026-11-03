import type { Itinerary } from "../schemas/itinerary.response.schema";
import type { Research } from "../schemas/research.response.schema";

const ICON = { morning: "🌅", afternoon: "☀️", evening: "🌙" } as const;

export function itineraryToMarkdown(it: Itinerary, r: Research): string {
    const cur = r.budget.localCurrency;
    const n = (x: number) => x.toLocaleString();
    const money = (x: number | null, est = false) =>
        x == null ? "price n/a" : `${est ? "~" : ""}${n(x)} ${cur}`;
    const b = r.budget.breakdownLocal;

    const out: string[] = [
        `# ${it.title}`,
        "",
        it.summary,
        "",
        `**Weather:** ${r.weather.summary}`,
        "",
        "## Budget",
        `${n(r.budget.originalAmount)} ${r.budget.originalCurrency} ≈ **${n(r.budget.localAmount)} ${cur}** (~${n(r.budget.perDayLocal)} ${cur}/day)`,
        "",
        "| Stay | Food | Transport | Activities | Buffer |",
        "|---|---|---|---|---|",
        `| ${n(b.stay)} | ${n(b.food)} | ${n(b.transport)} | ${n(b.activities)} | ${n(b.buffer)} |`,
        "",
        "## Where you'll stay",
        `**${it.stay.name}** (${it.stay.area}), ${money(it.stay.pricePerNightLocal)}/night. ${it.stay.reason}`,
        "",
    ];

    for (const d of it.days) {
        out.push(`## Day ${d.day}: ${d.theme}`);
        let dayTotal = 0;
        for (const i of d.items) {
            dayTotal += i.estCostLocal ?? 0;
            out.push(
                `- ${ICON[i.timeSlot]} **${i.title}** (${i.area}): ${i.description} · ${money(i.estCostLocal, i.isEstimate)}`,
            );
        }
        out.push("", `*Listed activities: ${money(dayTotal)}*`, "");
    }

    const section = (title: string, xs: string[]) =>
        xs.length ? [`## ${title}`, ...xs.map((x) => `- ${x}`), ""] : [];

    out.push(
        ...section("Warnings", [
            ...new Set([...r.weather.warnings, ...it.warnings]),
        ]),
        ...section("Tips", it.tips),
        ...section("Assumptions", it.assumptions),
    );

    return out.join("\n");
}
