"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import About3DSymbols from "./About3DSymbols";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/lib/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const scrollProgressRef = useRef<number>(0.5);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isReducedMotion()) return;
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const statement = statementRef.current;
    if (!section || !statement) return;

    if (isReducedMotion()) {
      const lines = statement.querySelectorAll(".statement-line");
      lines.forEach((l) => gsap.set(l, { opacity: 1, y: 0 }));
      return;
    }

    const lines = statement.querySelectorAll(".statement-line");

    const ctx = gsap.context(() => {
      // Track scroll progress for 3D symbols parallax
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });

      // 1. Editorial entrance for the section header label
      gsap.fromTo(
        ".about-header-label",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Entrance choreography for the 4 technical symbol markers
      gsap.fromTo(
        ".symbol-marker-tl",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".symbol-marker-tr",
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".symbol-marker-bl",
        { opacity: 0, x: -20, y: 12 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 65%" },
        }
      );
      gsap.fromTo(
        ".symbol-marker-br",
        { opacity: 0, x: 20, y: 12 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 65%" },
        }
      );

      // 3. Subtle scroll-driven progressive brightening of the main statement lines
      gsap.fromTo(
        lines,
        {
          opacity: 0.25,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          ease: "none",
          scrollTrigger: {
            trigger: statement,
            start: "top 78%",
            end: "bottom 48%",
            scrub: 0.8,
          },
        }
      );

      // 4. Supporting bottom content entrance
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#07090C] py-32 sm:py-48 px-6 sm:px-12 md:px-24 border-b border-white/[0.08] overflow-hidden select-none"
    >
      {/* ======================================================================= */}
      {/* 1. SUBTLE TECHNICAL GRID & ATMOSPHERIC HAZE (Z-1)                       */}
      {/* ======================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0.2) 20%, black 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0.2) 20%, black 90%)",
        }}
      />

      {/* Hairline Technical Vertical Guide Lines */}
      <div className="absolute left-6 sm:left-12 md:left-24 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none z-[1]" />
      <div className="absolute right-6 sm:right-12 md:right-24 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none z-[1]" />

      {/* ======================================================================= */}
      {/* 2. SHARED 3D SYMBOL SYSTEM CANVAS (Z-2)                                 */}
      {/* Four small blue 3D symbols framing the composition:                    */}
      {/* Crescent (TL), Cube (TR), Smiley (BL), Cursor (BR)                     */}
      {/* ======================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <About3DSymbols mousePos={mousePos} scrollProgressRef={scrollProgressRef} />
      </div>

      {/* ======================================================================= */}
      {/* ======================================================================= */}
      {/* 3. TECHNICAL LABELS & ENGINEERING METADATA (Z-3)                        */}
      {/* Subtly anchored near the 4 perimeter 3D symbols                        */}
      {/* ======================================================================= */}
      {/* TOP-LEFT: AERO / 01 (near Crescent) */}
      <div className="symbol-marker-tl absolute top-[5%] sm:top-[6%] left-[2.5%] sm:left-[4%] flex flex-col gap-1 pointer-events-none select-none z-[3]">
        <div className="flex items-center gap-2 font-tech text-[9.5px] text-[#F2F0EA]/[0.58]">
          <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
          <span>AERO / 01</span>
        </div>
        <div className="flex items-center gap-2 pl-[13px] font-tech-meta text-[8.5px] text-[#F2F0EA]/[0.42]">
          <span className="w-4 h-[1px] bg-white/[0.08]" />
          <span>DOWNFORCE DYNAMICS</span>
        </div>
      </div>

      {/* TOP-RIGHT: SYSTEM / 02 (near Cube) */}
      <div className="symbol-marker-tr absolute top-[5%] sm:top-[6%] right-[2.5%] sm:right-[4%] flex flex-col items-end gap-1 pointer-events-none select-none z-[3]">
        <div className="flex items-center gap-2 font-tech text-[9.5px] text-[#F2F0EA]/[0.58]">
          <span>SYSTEM / 02</span>
          <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 pr-[13px] font-tech-meta text-[8.5px] text-[#F2F0EA]/[0.42]">
          <span>GPU ARCHITECTURE</span>
          <span className="w-4 h-[1px] bg-white/[0.08]" />
        </div>
      </div>

      {/* BOTTOM-LEFT: MOTION / 03 (near Smiley) */}
      <div className="symbol-marker-bl absolute bottom-[5%] sm:bottom-[6%] left-[2.5%] sm:left-[4%] flex items-center gap-2 pointer-events-none select-none z-[3]">
        <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
        <span className="font-tech text-[9.5px] text-[#F2F0EA]/[0.58]">
          MOTION / 03
        </span>
      </div>

      {/* BOTTOM-RIGHT: PHYSICAL WEBGL / 04 (near Cursor) */}
      <div className="symbol-marker-br absolute bottom-[5%] sm:bottom-[6%] right-[2.5%] sm:right-[4%] flex items-center gap-2 pointer-events-none select-none z-[3]">
        <span className="font-tech text-[9.5px] text-[#F2F0EA]/[0.58]">
          PHYSICAL WEBGL / 04
        </span>
        <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
      </div>

      {/* Perimeter Plus Marks around the composition */}
      <div className="absolute top-[22%] left-[3.5%] text-white/20 text-[9px] font-tech pointer-events-none z-[3]">
        +
      </div>
      <div className="absolute top-[24%] right-[3.5%] text-white/20 text-[9px] font-tech pointer-events-none z-[3]">
        +
      </div>
      <div className="absolute bottom-[20%] left-[4%] text-white/20 text-[9px] font-tech pointer-events-none z-[3]">
        +
      </div>
      <div className="absolute bottom-[20%] right-[4%] text-white/20 text-[9px] font-tech pointer-events-none z-[3]">
        +
      </div>

      {/* ======================================================================= */}
      {/* 4. MAIN EDITORIAL CONTENT LAYER (Z-10)                                 */}
      {/* ======================================================================= */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Label Header */}
        <div className="about-header-label flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#62D9FF] rounded-none animate-pulse" />
            <span className="text-[10px] font-tech tracking-[0.20em] uppercase text-[#AFDDFF] font-medium">
              ABOUT ITZFIZZ // STATEMENT
            </span>
          </div>

          <div className="flex items-center gap-4 text-[9.5px] font-tech-meta tracking-[0.18em] text-neutral-400 uppercase">
            <span className="text-[#AFDDFF]/70">PRECISION / AUTOMOTIVE</span>
            <span className="text-white/20">&bull;</span>
            <span>DIGITAL STORYTELLING</span>
          </div>
        </div>

        {/* Large Editorial Statement (Orbitron bold 600-700, 0.06em tracking) */}
        <h2
          ref={statementRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-[0.06em] uppercase leading-[1.25] text-[#F2F0EA] max-w-5xl"
        >
          <div className="statement-line mb-1 sm:mb-2 transition-colors duration-300">
            WE ENGINEER EXPERIENCES AT THE
          </div>
          <div className="statement-line mb-1 sm:mb-2 transition-colors duration-300">
            INTERSECTION OF
          </div>
          <div className="statement-line mb-1 sm:mb-2 transition-colors duration-300">
            HIGH-PERFORMANCE WEB
          </div>
          <div className="statement-line mb-1 sm:mb-2 transition-colors duration-300">
            COMPUTING AND CINEMATIC
          </div>
          <div className="statement-line transition-colors duration-300 text-[#F2F0EA] hover:text-[#AFDDFF]">
            DIGITAL STORYTELLING.
          </div>
        </h2>

        {/* Supporting Paragraph & CTA Grid */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-16 sm:mt-24 pt-12 border-t border-white/[0.08]"
        >
          {/* Left Column: Architectural Focus Label */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-[11px] font-medium tracking-[0.16em] text-[#AFDDFF] uppercase">
              [ ARCHITECTURAL FOCUS ]
            </span>
            <span className="text-[9.5px] font-tech-meta text-neutral-400 uppercase">
              DIGITAL // ARCHITECTURE
            </span>
          </div>

          {/* Right Column: Statement Body & Interactive CTA Link */}
          <div className="md:col-span-8 flex flex-col gap-8 relative z-20">
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-[1.65] tracking-[0.02em] max-w-2xl">
              ITZFIZZ builds real-time, GPU-accelerated digital environments designed
              to captivate audiences. By combining Three.js WebGL rendering,
              deterministic scroll choreography, and editorial typography, every touchpoint
              delivers automotive-grade precision.
            </p>

            {/* Editorial Interactive CTA Link */}
            <div>
              <a
                href="#services"
                className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-[#F2F0EA] hover:text-[#AFDDFF] uppercase group transition-colors duration-300 select-none py-1"
              >
                <span>DISCOVER CAPABILITIES</span>
                <span className="w-8 h-[1px] bg-[#AFDDFF] group-hover:w-14 transition-all duration-300" />
                <span className="text-[10px] text-[#AFDDFF] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
