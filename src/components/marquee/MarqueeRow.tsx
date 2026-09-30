"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MarqueeTile {
  id: string;
  tag: string;
  title: string;
  metric: string;
  accent: string;
}

interface MarqueeRowProps {
  tiles: MarqueeTile[];
  direction: "left" | "right";
  speed?: number;
}

export default function MarqueeRow({
  tiles,
  direction,
}: MarqueeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Scroll-driven horizontal travel
    const distance = direction === "right" ? 280 : -280;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        x: distance,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });

    return () => ctx.revert();
  }, [direction]);

  // Triple items for seamless horizontal loop
  const displayTiles = [...tiles, ...tiles, ...tiles];

  return (
    <div className="w-full overflow-hidden py-3">
      <div
        ref={rowRef}
        className="flex items-center gap-6 will-change-transform"
        style={{
          transform: `translate3d(${direction === "right" ? -140 : 0}px, 0, 0)`,
        }}
      >
        {displayTiles.map((tile, idx) => (
          <div
            key={`${tile.id}-${idx}`}
            className="flex-shrink-0 w-72 sm:w-84 md:w-96 rounded-2xl bg-gradient-to-br from-[#121418] via-[#0c0d10] to-[#07080a] border border-white/[0.09] p-6 hover:border-cyan-500/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between text-[10px] font-tech text-neutral-400 uppercase tracking-[0.16em] mb-4">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDFF] group-hover:scale-125 transition-transform" />
                {tile.tag}
              </span>
              <span className="text-white/80 tabular-nums font-bold tracking-wider text-xs">{tile.metric}</span>
            </div>

            <div className="text-lg sm:text-xl font-bold tracking-[0.06em] text-white uppercase group-hover:text-[#AFDDFF] transition-colors">
              {tile.title}
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[9.5px] font-tech-meta text-neutral-400 tracking-[0.16em]">
              <span>EXPLORE CAPABILITY</span>
              <span className="text-[#AFDDFF] group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
