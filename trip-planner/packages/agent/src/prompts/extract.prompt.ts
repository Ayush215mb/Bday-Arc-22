export const EXTRACT_PROMPT = `Extract trip details from the user's message.
Use null for anything not stated. Never guess destinations, dates, budgets, or currencies.
Interests should be a short list of topics the user mentioned (food, temples, hiking, etc.).
If they gave no interests, return an empty array.`;
