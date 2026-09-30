"use client";

import React, { useEffect, useState } from "react";
import { isReducedMotion } from "@/lib/animation";

interface HeroOverlayProps {
  progress: number;
}

export default function HeroOverlay({ progress }: HeroOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReducedMotion(isReducedMotion());
  }, []);

  // Typography subtly yields as car travels across the center (progress 0.35 -> 0.8)
  const contentOpacity = reducedMotion
    ? 1
    : Math.max(0.15, Math.min(1, 1 - Math.max(0, (progress - 0.35) * 1.8)));

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 sm:p-12 md:p-16 transition-opacity duration-300"
      style={{ opacity: contentOpacity }}
    >
      {/* Top spacer (Navigation sits above) */}
      <div className="h-16" />

      {/* Primary Display Typography */}
      <div className="flex flex-col max-w-4xl">
        {/* Staged entrance item 1: Supporting badge */}
        <div
          className={`flex items-center gap-3 transition-all duration-700 delay-200 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDFF]" />
          <span className="text-[10px] font-tech tracking-[0.20em] uppercase text-[#AFDDFF] font-medium">
            Creative Engineering // Automotive Precision
          </span>
        </div>

        {/* Staged entrance item 2: Large Display Headline */}
        <h1
          className={`text-4xl sm:text-6xl md:text-8xl font-bold tracking-[0.08em] text-white uppercase mt-4 leading-[0.95] transition-all duration-1000 delay-300 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          Digital
          <br />
          <span className="text-neutral-500 hover:text-white transition-colors duration-500">
            Experiences.
          </span>
        </h1>

        {/* Supporting description */}
        <p
          className={`text-sm sm:text-base text-neutral-300 max-w-lg mt-6 font-normal leading-[1.65] tracking-[0.02em] transition-all duration-700 delay-400 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          Architecting real-time 3D web platforms, high-performance systems, and
          cinematic automotive experiences.
        </p>
      </div>

      {/* Hero Stats & Scroll Indicator Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8 border-t border-white/10">
        {/* Hero Stats: 95%, 87%, 92% */}
        <div
          className={`grid grid-cols-3 gap-6 sm:gap-12 transition-all duration-1000 delay-500 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <div className="text-2xl sm:text-4xl font-bold tabular-nums text-white tracking-tight">
              95<span className="text-[#AFDDFF] text-lg sm:text-2xl">%</span>
            </div>
            <div className="text-[9.5px] font-tech tracking-[0.16em] text-neutral-400 uppercase mt-1">
              Performance
            </div>
            <div className="hidden sm:block text-[8.5px] text-neutral-500 font-tech-meta mt-0.5 tabular-nums">
              60 FPS WebGL
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-4xl font-bold tabular-nums text-white tracking-tight">
              87<span className="text-[#AFDDFF] text-lg sm:text-2xl">%</span>
            </div>
            <div className="text-[9.5px] font-tech tracking-[0.16em] text-neutral-400 uppercase mt-1">
              Immersion
            </div>
            <div className="hidden sm:block text-[8.5px] text-neutral-500 font-tech-meta mt-0.5">
              User Engagement
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-4xl font-bold tabular-nums text-white tracking-tight">
              92<span className="text-[#AFDDFF] text-lg sm:text-2xl">%</span>
            </div>
            <div className="text-[9.5px] font-tech tracking-[0.16em] text-neutral-400 uppercase mt-1">
              Impact
            </div>
            <div className="hidden sm:block text-[8.5px] text-neutral-500 font-tech-meta mt-0.5">
              Conversion Rate
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`flex items-center gap-3 transition-all duration-700 delay-700 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-[9.5px] font-tech tracking-[0.18em] text-neutral-400 uppercase">
            Scroll To Drive
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-[#AFDDFF] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
