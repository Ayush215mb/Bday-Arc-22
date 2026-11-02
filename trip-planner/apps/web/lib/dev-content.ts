import { BadgeCheck, Code2, FileText, Mail, Trophy, Users } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/BrandIcons";

export const DEV = {
    name: "Ayush Yadav",
    handle: "@glevoidd",
    role: "Full-Stack Developer",
    location: "Kolkata, India",
    avatar: "https://www.glevoidd.in/AyushYadav.jpeg",
    tagline: "I own the work until it works.",
    bio: "I design and ship full-stack products end to end: backend architecture, frontend design, state across 30 screens.",
    links: [
        {
            label: "GitHub",
            href: "https://github.com/Ayush215mb",
            icon: GitHubIcon,
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/ayush215mb/",
            icon: LinkedInIcon,
        },
        { label: "X", href: "https://x.com/Glevoidd", icon: XIcon },
        {
            label: "LeetCode",
            href: "https://leetcode.com/ayush215mb",
            icon: Code2,
        },
        {
            label: "Résumé",
            href: "https://www.glevoidd.in/CV-AyushYadav.pdf",
            icon: FileText,
        },
        { label: "Email", href: "mailto:ayush215mb@gmail.com", icon: Mail },
    ],
    highlights: [
        {
            icon: BadgeCheck,
            title: "Patent holder",
            body: "Original work, formally protected.",
        },
        {
            icon: Trophy,
            title: "Hackathon winner",
            body: "Ships fast, under pressure.",
        },
        {
            icon: Users,
            title: "GDG NiT co-founder",
            body: "A 2,500-member developer community.",
        },
    ],
    stack: [
        {
            group: "Languages",
            items: ["JavaScript", "TypeScript", "Python", "C++"],
        },
        {
            group: "Frontend",
            items: [
                "React",
                "React Native",
                "Next.js",
                "Tailwind",
                "Expo",
                "Redux Toolkit",
                "React Query",
            ],
        },
        {
            group: "Backend",
            items: ["Node.js", "Express", "NestJS", "Socket.io"],
        },
        {
            group: "Data & tools",
            items: ["MongoDB", "Supabase", "PostgreSQL", "Git", "Docker"],
        },
    ],
    projects: [
        {
            name: "Project Sentinel",
            body: "Real-time AI governance proxy: PII redaction and prompt-injection blocking before requests reach the LLM.",
            href: "https://sentinel.theprinceraj.tech/",
        },
        {
            name: "Kolkata Parking",
            body: "Community-driven parking finder on Next.js, Supabase and Leaflet.",
            href: "https://kolkata-parking.vercel.app/",
        },
        {
            name: "Parse Spy",
            body: "Automated forensic tool (Selenium + Electron) that cut investigation time by 90%.",
            href: "https://parsespy.vercel.app/",
        },
    ],
};
