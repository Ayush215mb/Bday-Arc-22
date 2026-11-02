import { Hero } from "@/components/home/Hero";
import { MarqueeBands } from "@/components/home/Marquee";
import { PipelineSection } from "@/components/home/PipelineSection";
import { ToolsBento } from "@/components/home/ToolsBento";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
    return (
        <>
            <main>
                <Hero />
                <MarqueeBands />
                <PipelineSection />
                <ToolsBento />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
