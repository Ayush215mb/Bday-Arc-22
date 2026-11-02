export type Role = "user" | "assistant";
export type MessageStatus = "streaming" | "done" | "error";

export interface ChatMessage {
    id: string;
    role: Role;
    content: string;
    status: MessageStatus;
}

export interface Activity {
    name: string;
    time?: string;
    description?: string;
    location?: string;
    cost?: string | number;
}

export interface ItineraryDay {
    day: number;
    title?: string;
    activities: Activity[];
}

export interface Itinerary {
    destination: string;
    summary?: string;
    totalCost?: string | number;
    currency?: string;
    days: ItineraryDay[];
}
