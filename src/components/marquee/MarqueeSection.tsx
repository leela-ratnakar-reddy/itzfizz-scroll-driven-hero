"use client";

import React from "react";
import MarqueeRow, { MarqueeTile } from "./MarqueeRow";

const ROW_ONE_TILES: MarqueeTile[] = [
  { id: "1", tag: "3D WEBGL", title: "Real-time Vehicle Configurator", metric: "60 FPS", accent: "#38bdf8" },
  { id: "2", tag: "GRAPHICS", title: "Procedural Asphalt Shaders", metric: "4K Res", accent: "#38bdf8" },
  { id: "3", tag: "PHYSICS", title: "Aerodynamic Telemetry", metric: "< 2ms Latency", accent: "#38bdf8" },
  { id: "4", tag: "MOTION", title: "Deterministic Scroll Engine", metric: "GSAP 3", accent: "#38bdf8" },
];

const ROW_TWO_TILES: MarqueeTile[] = [
  { id: "5", tag: "SYSTEMS", title: "Spatial Web Architecture", metric: "WebGL 2.0", accent: "#38bdf8" },
  { id: "6", tag: "IMMERSION", title: "Cinematic Lighting Pipeline", metric: "PBR Spec", accent: "#38bdf8" },
  { id: "7", tag: "UX DESIGN", title: "Tactile Automotive Interface", metric: "Zero Lag", accent: "#38bdf8" },
  { id: "8", tag: "ENGINEERING", title: "Ultra-Light GLTF Delivery", metric: "7.2 MB", accent: "#38bdf8" },
];

export default function MarqueeSection() {
  return (
    <section className="relative w-full bg-black py-20 border-b border-white/[0.08] overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/[0.03] blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-medium tracking-[0.20em] uppercase text-[#AFDDFF] font-tech">
            CAPABILITY MARQUEE // INTERACTIVE STACK
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-[0.08em] mt-2">
            Engineering The Next Standard
          </h2>
        </div>
        <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.14em]">
          Dynamic Kinetic Scroll
        </span>
      </div>

      {/* Row 1: Moves right on scroll */}
      <MarqueeRow tiles={ROW_ONE_TILES} direction="right" />

      {/* Row 2: Moves left on scroll */}
      <MarqueeRow tiles={ROW_TWO_TILES} direction="left" />
    </section>
  );
}
