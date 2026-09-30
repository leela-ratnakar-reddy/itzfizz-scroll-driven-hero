"use client";

import React, { useRef, useEffect } from "react";
import BenefitCard, { BenefitData } from "./BenefitCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/lib/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BENEFITS_DATA: BenefitData[] = [
  {
    number: "01",
    title: "IMMERSIVE",
    description:
      "Experiences designed to hold attention through motion, interaction and visual storytelling.",
    isCenter: false,
  },
  {
    number: "02",
    title: "PRECISION",
    description:
      "A balance of design, technology and performance across every interaction.",
    isCenter: true,
  },
  {
    number: "03",
    title: "IMPACT",
    description:
      "Digital experiences designed to communicate clearly and leave a memorable impression.",
    isCenter: false,
  },
];

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    if (isReducedMotion()) return;

    const cards = container.querySelectorAll(".benefit-card-wrapper");

    const ctx = gsap.context(() => {
      // Entrance sequence:
      // 0ms: section label
      // 150ms: main heading
      // 300ms: card shells
      // 450ms: 3D components emerge
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".benefits-header-label",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          ".benefits-header-title",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          cards,
          { opacity: 0, y: 45, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.14,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.3"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="relative w-full bg-[#000000] pt-44 sm:pt-56 md:pt-60 pb-32 sm:pb-48 px-6 sm:px-12 md:px-24 border-b border-white/[0.08] overflow-hidden select-none scroll-mt-28 sm:scroll-mt-32"
    >
      {/* Subtle Lūmen Technical Vertical Guide Lines */}
      <div className="absolute left-6 sm:left-12 md:left-24 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none z-0" />
      <div className="absolute right-6 sm:right-12 md:right-24 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-28 sm:mb-40 md:mb-44">
          <div>
            <div className="benefits-header-label flex items-center gap-3 mb-3">
              <span className="w-1.5 h-1.5 bg-[#62D9FF] rounded-none animate-pulse" />
              <span className="text-[10px] tracking-[0.20em] uppercase text-[#AFDDFF] font-medium font-tech">
                KEY BENEFITS // THREE PILLARS
              </span>
            </div>
            <h2 className="benefits-header-title text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.10em] text-white uppercase">
              Engineered For Impact
            </h2>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 text-[11px] font-medium text-neutral-400 uppercase tracking-[0.14em]">
            <span>Measurable Standard</span>
            <span className="text-[9.5px] text-[#AFDDFF]/60 tracking-[0.18em] tabular-nums">
              3D AUTOMOTIVE TELEMETRY
            </span>
          </div>
        </div>

        {/* 3-Column Card Grid with 3D components emerging */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {BENEFITS_DATA.map((benefit) => (
            <div key={benefit.number} className="benefit-card-wrapper h-full flex">
              <BenefitCard benefit={benefit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
