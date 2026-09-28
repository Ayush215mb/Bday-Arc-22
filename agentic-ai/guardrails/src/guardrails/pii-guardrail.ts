export type PIIType =
    | "secret"
    | "email"
    | "credit_card"
    | "ssn"
    | "aadhaar"
    | "pan"
    | "ipv4"
    | "phone";

export interface PIIFinding {
    type: PIIType;
    start: number;
    end: number;
}

export interface GuardrailResult {
    flagged: boolean;
    findings: PIIFinding[];
    redacted: string;
}

const luhn = (digits: string): boolean => {
    let sum = 0;
    let double = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let n = digits.charCodeAt(i) - 48;
        if (double && (n *= 2) > 9) n -= 9;
        sum += n;
        double = !double;
    }
    return sum % 10 === 0;
};

const digitsOf = (s: string) => s.replace(/\D/g, "");

interface Detector {
    type: PIIType;
    pattern: RegExp;
    validate?: (match: string) => boolean;
}

// Order = priority. When matches overlap, the earlier detector wins.
const DETECTORS: Detector[] = [
    {
        type: "secret",
        pattern:
            /\b(?:sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{36,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
    },
    {
        type: "email",
        pattern:
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g,
    },
    {
        type: "credit_card",
        pattern: /\b(?:\d[ -]?){12,18}\d\b/g,
        validate: (m) => {
            const d = digitsOf(m);
            return d.length >= 13 && d.length <= 19 && luhn(d);
        },
    },
    {
        type: "ssn",
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        validate: (m) =>
            !/^(000|666|9)/.test(m) &&
            m.slice(4, 6) !== "00" &&
            m.slice(7) !== "0000",
    },
    { type: "aadhaar", pattern: /\b[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}\b/g },
    { type: "pan", pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g },
    {
        type: "ipv4",
        pattern:
            /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
    },
    {
        type: "phone",
        pattern: /(?<![\w.])\+?\d[\d\s().-]{8,16}\d(?![\w-])/g,
        validate: (m) => {
            const n = digitsOf(m).length;
            return n >= 10 && n <= 13;
        },
    },
];

export function detectPII(text: string, types?: PIIType[]): PIIFinding[] {
    const findings: PIIFinding[] = [];
    const overlaps = (s: number, e: number) =>
        findings.some((f) => s < f.end && e > f.start);

    for (const { type, pattern, validate } of DETECTORS) {
        if (types && !types.includes(type)) continue;
        for (const m of text.matchAll(pattern)) {
            const start = m.index!;
            const end = start + m[0].length;
            if (validate && !validate(m[0])) continue;
            if (overlaps(start, end)) continue;
            findings.push({ type, start, end });
        }
    }
    return findings.sort((a, b) => a.start - b.start);
}

export function piiGuardrail(text: string, types?: PIIType[]): GuardrailResult {
    const findings = detectPII(text, types);
    let redacted = "";
    let cursor = 0;
    for (const f of findings) {
        redacted +=
            text.slice(cursor, f.start) + `[REDACTED_${f.type.toUpperCase()}]`;
        cursor = f.end;
    }
    redacted += text.slice(cursor);
    return { flagged: findings.length > 0, findings, redacted };
}
