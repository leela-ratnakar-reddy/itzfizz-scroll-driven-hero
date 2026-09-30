"use client";

import React, { useRef, useEffect } from "react";
import ServiceItem, { ServiceData } from "./ServiceItem";
import ServicesVideoMotion from "./ServicesVideoMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/lib/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES_DATA: ServiceData[] = [
  {
    number: "01",
    title: "DIGITAL EXPERIENCES",
    description:
      "Crafting immersive narrative journeys where web graphics, typography, and motion synchronize into a cohesive brand world.",
    tags: ["Creative Direction", "Motion Systems", "Brand Storytelling"],
  },
  {
    number: "02",
    title: "WEB DEVELOPMENT",
    description:
      "Modern Next.js and TypeScript architecture built for speed, responsiveness, and uncompromising structural stability.",
    tags: ["Full-Stack", "SSR / Edge", "Micro-Interactions"],
  },
  {
    number: "03",
    title: "3D / INTERACTIVE EXPERIENCES",
    description:
      "Real-time Three.js WebGL environments, custom GLTF shaders, and physical automotive visualization rendered directly in-browser.",
    tags: ["Three.js", "R3F / Drei", "Custom Shaders"],
  },
  {
    number: "04",
    title: "UI / UX",
    description:
      "Tactile, minimal interfaces designed for effortless clarity, high-conversion ergonomics, and visual restraint.",
    tags: ["Interface Design", "Design Systems", "Prototyping"],
  },
  {
    number: "05",
    title: "DIGITAL SOLUTIONS",
    description:
      "Scalable platforms and technical architectures engineered to handle demanding commercial workloads and global audiences.",
    tags: ["Performance Audits", "Scalability", "API Architecture"],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    if (isReducedMotion()) return;

    const rows = container.querySelectorAll(".service-row-wrapper");

    const ctx = gsap.context(() => {
      // Editorial Choreographed Entrance for each service row:
      // Sequence: service number ↓ service title ↓ description ↓ tags ↓ technical accents
      // with ~120ms stagger and cubic-bezier easing
      rows.forEach((row) => {
        const num = row.querySelector(".service-num");
        const title = row.querySelector(".service-title");
        const desc = row.querySelector(".service-desc");
        const tags = row.querySelector(".service-tags");
        const accent = row.querySelector(".service-tech-accent");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          [num, title, desc, tags, accent],
          {
            opacity: 0,
            y: 22,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-[#000000] py-32 sm:py-48 px-6 sm:px-12 md:px-24 border-b border-white/[0.08] overflow-hidden select-none"
    >
      {/* ======================================================================= */}
      {/* LŪMEN VIDEO-DRIVEN CINEMATIC MOTION SYSTEM (BACKGROUND)                 */}
      {/* 4 distinct instances of the exact CloudFront MP4 gliding dynamically   */}
      {/* ======================================================================= */}
      <ServicesVideoMotion sectionRef={sectionRef} />

      {/* Subtle Lūmen Technical Vertical Guide Lines */}
      <div className="absolute left-6 sm:left-12 md:left-24 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none z-0" />
      <div className="absolute right-6 sm:right-12 md:right-24 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none z-0" />

      {/* Content Container (Layered above video: relative z-10) */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with technical automotive typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-20 sm:mb-28">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 bg-[#62D9FF] rounded-none animate-pulse" />
              <span className="text-[10px] tracking-[0.20em] uppercase text-[#AFDDFF] font-medium font-tech">
                CORE CAPABILITIES // CAP_01 &bull; 05
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[0.10em] text-[#F2F0EA] uppercase">
              Services
            </h2>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className="text-[11px] font-medium text-neutral-300 uppercase tracking-[0.14em]">
              Disciplined Creative Execution
            </span>
            <span className="text-[9.5px] text-[#AFDDFF]/60 tracking-[0.18em] uppercase font-tech-meta tabular-nums">
              MOTION // AERODYNAMIC_FLOW_SYS
            </span>
          </div>
        </div>

        {/* Service Rows (Editorial list with negative space rhythm) */}
        <div
          ref={containerRef}
          className="flex flex-col border-t border-white/[0.08]"
        >
          {SERVICES_DATA.map((service, index) => (
            <div key={service.number} className="service-row-wrapper">
              <ServiceItem service={service} index={index} />
            </div>
          ))}
        </div>

        {/* Technical Footer Accent of the Services Section */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[9.5px] font-tech text-neutral-400 uppercase tracking-[0.16em]">
          <div className="flex items-center gap-3">
            <span className="text-[#AFDDFF]">□</span>
            <span>SYSTEM READY // ITZFIZZ DIGITAL KERNEL</span>
          </div>
          <div className="flex items-center gap-3">
            <span>SCROLL VELOCITY SYNCHRONIZED</span>
            <span className="text-[#62D9FF]">+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
