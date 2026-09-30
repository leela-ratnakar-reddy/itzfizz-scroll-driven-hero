"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/lib/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector(".cta-heading"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full bg-[#000000] py-36 sm:py-52 px-6 sm:px-12 md:px-24 border-b border-white/[0.08] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-cyan-500/[0.04] blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#AFDDFF]" />
          <span className="text-[10px] font-tech tracking-[0.20em] uppercase text-[#AFDDFF] font-medium">
            INITIATE ENGAGEMENT // ITZFIZZ
          </span>
        </div>

        {/* Large Typography Headline */}
        <h2 className="cta-heading text-3xl sm:text-5xl md:text-7xl font-bold tracking-[0.08em] text-white uppercase leading-[1.05]">
          Let&apos;s Build
          <br />
          <span className="text-neutral-500 hover:text-[#AFDDFF] transition-colors duration-500">
            What&apos;s Next.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 font-normal max-w-xl mt-8 leading-[1.65] tracking-[0.02em]">
          From real-time automotive WebGL to deterministic digital platforms, we architect
          experiences that command attention.
        </p>

        {/* Action Button */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="mailto:contact@itzfizz.com"
            className="text-xs font-bold tracking-[0.16em] uppercase bg-white text-black hover:bg-[#AFDDFF] px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-[#AFDDFF]/10"
          >
            START A PROJECT &rarr;
          </a>
          <a
            href="#hero"
            className="text-xs font-medium tracking-[0.16em] uppercase text-neutral-400 hover:text-white border border-white/20 hover:border-white/40 px-8 py-4 rounded-full transition-all"
          >
            BACK TO TOP &uarr;
          </a>
        </div>
      </div>
    </section>
  );
}
