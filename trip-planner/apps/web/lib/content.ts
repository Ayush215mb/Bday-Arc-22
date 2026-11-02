import {
    Banknote,
    Calculator,
    CloudSun,
    Globe,
    LayoutList,
    MapPin,
    Repeat,
    ScanText,
    Split,
    type LucideIcon,
} from "lucide-react";

export const SITE = {
    name: "Trip Planner",
    description:
        "An AI agent that pulls real places, weather and exchange rates, then builds a day-by-day itinerary.",
};

export const DESTINATIONS = [
    "Kyoto",
    "Goa",
    "Lisbon",
    "Reykjavík",
    "Marrakech",
    "Hanoi",
    "Gokarna",
];

export const STACK_ITEMS = [
    "Tavily",
    "Geoapify",
    "OpenWeather",
    "ExchangeRate",
    "LangGraph",
    "LangChain",
    "Ollama",
    "Hono",
    "SSE",
];

export type StepKind = "extract" | "parallel" | "loop" | "format";

export const PIPELINE: {
    n: string;
    title: string;
    body: string;
    tone: string;
    icon: LucideIcon;
    kind: StepKind;
}[] = [
    {
        n: "01",
        title: "Extract",
        body: "Reads your message and pulls out destination, days and budget. Something missing? It asks before it burns a single token.",
        tone: "bg-sun",
        icon: ScanText,
        kind: "extract",
    },
    {
        n: "02",
        title: "Gather in parallel",
        body: "Currency, weather and places fire at the same moment, not one after another.",
        tone: "bg-pink",
        icon: Split,
        kind: "parallel",
    },
    {
        n: "03",
        title: "Plan ⇄ Tools",
        body: "The planner drafts, calls Tavily when it needs live facts, and loops. The tool calls are capped so it never spirals.",
        tone: "bg-leaf",
        icon: Repeat,
        kind: "loop",
    },
    {
        n: "04",
        title: "Format",
        body: "Everything lands in a strict schema: destination, summary, cost, then day by day.",
        tone: "bg-goji",
        icon: LayoutList,
        kind: "format",
    },
];

export const TOOLS: {
    name: string;
    body: string;
    tone: string;
    icon: LucideIcon;
    span: string;
}[] = [
    {
        name: "Tavily Search",
        body: "Live web search for events, openings and anything the model shouldn't guess.",
        tone: "bg-sun",
        icon: Globe,
        span: "lg:col-span-2 lg:row-span-2",
    },
    {
        name: "Places",
        body: "Real attractions via Geoapify, geocoded.",
        tone: "bg-pink",
        icon: MapPin,
        span: "",
    },
    {
        name: "Weather",
        body: "Forecast for your exact dates.",
        tone: "bg-leaf",
        icon: CloudSun,
        span: "",
    },
    {
        name: "Currency",
        body: "Budget converted at live rates.",
        tone: "bg-goji",
        icon: Banknote,
        span: "",
    },
    {
        name: "Calculator",
        body: "Totals done by maths, not vibes.",
        tone: "bg-cream",
        icon: Calculator,
        span: "",
    },
];

export const SUGGESTIONS = [
    {
        label: "5 days in Kyoto · ¥80,000",
        prompt: "Plan a 5-day trip to Kyoto for 2 people in April. Budget ¥80,000. Interested in temples, food, and one live show if anything is on.",
        tone: "bg-sun",
    },
    {
        label: "Goa weekend · ₹25,000",
        prompt: "Plan a 3-day weekend in Goa for 4 friends under ₹25,000. Beaches, seafood and some nightlife.",
        tone: "bg-pink",
    },
    {
        label: "Slow week in Lisbon",
        prompt: "Plan a slow-travel week in Lisbon in May. Cafés, viewpoints, day trips by train, mid-range budget.",
        tone: "bg-leaf",
    },
    {
        label: "Goa or Gokarna?",
        prompt: "I have 4 days and can't decide between Goa and Gokarna. Help me pick, then plan it.",
        tone: "bg-goji",
    },
];
