import {
    Map,
    Compass,
    Wallet,
    Mountain,
    Car,
    MapPin,
    LucideIcon,
} from "lucide-react";

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

export interface Suggestion {
    id: string;
    title: string;
    description: string;
    prompt: string;
    icon: LucideIcon;
}
export const suggestions: Suggestion[] = [
    {
        id: "itinerary",
        title: "Plan a trip",
        description: "Create a personalised itinerary for your next getaway.",
        prompt: "Plan a 3-day trip to ",
        icon: Map,
    },
    {
        id: "destination",
        title: "Explore destinations",
        description: "Discover places that match your travel interests.",
        prompt: "Suggest some destinations for a ",
        icon: Compass,
    },
    {
        id: "budget",
        title: "Travel on a budget",
        description: "Find the best experiences within your budget.",
        prompt: "Plan a trip under ₹",
        icon: Wallet,
    },
    {
        id: "weekend",
        title: "Weekend getaway",
        description: "Find the perfect escape for your next weekend.",
        prompt: "Suggest weekend getaways from ",
        icon: Mountain,
    },
    {
        id: "roadtrip",
        title: "Plan a road trip",
        description: "Map out routes, stops, and experiences.",
        prompt: "Plan a road trip from ",
        icon: Car,
    },
    {
        id: "discover",
        title: "Local experiences",
        description: "Discover hidden gems, food, and local attractions.",
        prompt: "Find unique local experiences in ",
        icon: MapPin,
    },
];
