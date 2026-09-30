"use client";

import dynamic from "next/dynamic";
import Navigation from "@/components/navigation/Navigation";
import AboutSection from "@/components/about/AboutSection";
import ServicesSection from "@/components/services/ServicesSection";
import BenefitsSection from "@/components/benefits/BenefitsSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import MarqueeSection from "@/components/marquee/MarqueeSection";
import CTASection from "@/components/cta/CTASection";
import Footer from "@/components/footer/Footer";

// Dynamic import for WebGL Canvas & GSAP ScrollTrigger
const Hero3D = dynamic(() => import("@/components/hero3d/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#080A0D] flex flex-col items-center justify-center gap-3 select-none">
      <span className="text-2xl sm:text-3xl font-bold tracking-[0.16em] text-white/90 uppercase">
        ITZFIZZ
      </span>
      <span className="text-[10px] sm:text-[11px] font-tech tracking-[0.20em] text-[#AFDDFF]/70 uppercase">
        INITIALIZING EXPERIENCE
      </span>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#080A0D] text-white overflow-x-clip">
      {/* Persistent Navigation */}
      <Navigation />

      {/* Primary Cinematic 3D Automotive Hero Section */}
      <Hero3D />

      {/* Sequential Content Sections Below Transition */}
      <AboutSection />
      <ServicesSection />
      <BenefitsSection />
      <ProjectsSection />
      <MarqueeSection />
      <CTASection />
      <Footer />
    </main>
  );
}
