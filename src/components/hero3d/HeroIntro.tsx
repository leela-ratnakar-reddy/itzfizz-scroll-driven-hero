"use client";

import React from "react";

export default function HeroIntro() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] flex flex-col justify-between pt-28 pb-16 px-6 sm:px-12 md:px-24 bg-[#08090d] border-b border-white/[0.08]"
    >
      {/* Top spacer */}
      <div />

      {/* Main Display Headline */}
      <div className="max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDFF]" />
          <span className="text-[10px] font-tech tracking-[0.20em] uppercase text-[#AFDDFF] font-medium">
            Creative Engineering // Automotive Precision
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.08em] text-white uppercase leading-[0.95]">
          Digital
          <br />
          <span className="text-neutral-500 hover:text-white transition-colors duration-500">
            Experiences.
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-normal leading-[1.65] tracking-[0.02em] max-w-xl mt-8">
          Architecting real-time 3D web platforms, high-performance systems, and
          cinematic automotive experiences with sub-millisecond precision.
        </p>
      </div>

      {/* Preserved Key Statistics & Scroll Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-10 border-t border-white/[0.08] mt-12">
        {/* Preserved 3 Key Stats: 95%, 87%, 92% */}
        <div className="grid grid-cols-3 gap-6 sm:gap-14">
          <div>
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold tabular-nums text-white tracking-tight">
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
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold tabular-nums text-white tracking-tight">
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
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold tabular-nums text-white tracking-tight">
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

        {/* Scroll To Drive Cue */}
        <a
          href="#hero-track"
          className="flex items-center gap-3 text-[9.5px] font-tech tracking-[0.18em] text-neutral-400 hover:text-white uppercase transition-colors group"
        >
          <span>Scroll To Drive</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1 group-hover:border-[#AFDDFF] transition-colors">
            <div className="w-1 h-2 bg-[#AFDDFF] rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
