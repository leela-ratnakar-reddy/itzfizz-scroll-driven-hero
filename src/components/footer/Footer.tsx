"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] py-20 px-6 sm:px-12 md:px-24 border-t border-white/[0.08] text-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* Top Tier: Brand & Navigation */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
          <div className="flex flex-col gap-4 max-w-sm">
            <span className="text-xl sm:text-2xl font-bold tracking-[0.14em] uppercase text-white">
              ITZFIZZ
            </span>
            <p className="text-[10px] font-tech text-neutral-400 leading-relaxed uppercase tracking-[0.16em]">
              Creative Engineering // Real-time 3D Systems // Automotive Precision
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-[9.5px] font-tech text-neutral-400 uppercase tracking-[0.20em]">[ INDEX ]</span>
              <a href="#hero" className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300 hover:text-[#AFDDFF] transition-colors">HERO 3D</a>
              <a href="#work" className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300 hover:text-[#AFDDFF] transition-colors">WORK</a>
              <a href="#services" className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300 hover:text-[#AFDDFF] transition-colors">SERVICES</a>
              <a href="#about" className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300 hover:text-[#AFDDFF] transition-colors">ABOUT</a>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[9.5px] font-tech text-neutral-400 uppercase tracking-[0.20em]">[ SYSTEM ]</span>
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300">THREE.JS / R3F</span>
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300">NEXT.JS 14</span>
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300">GSAP SCROLL</span>
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300">WEBGL 2.0</span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[9.5px] font-tech text-neutral-400 uppercase tracking-[0.20em]">[ CONNECT ]</span>
              <a href="mailto:contact@itzfizz.com" className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300 hover:text-[#AFDDFF] transition-colors">CONTACT</a>
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-300">GLOBAL DISPATCH</span>
            </div>
          </div>
        </div>

        {/* Middle Tier: Required 3D Model Attribution & License */}
        <div className="p-6 rounded-2xl bg-[#090a0d] border border-white/[0.08] text-[11px] font-tech-meta text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDFF]" />
            <span>
              3D Model: <strong className="text-white font-medium">2010 Citroën DS Survolt</strong> by <strong className="text-white font-medium">Ddiaz Design</strong>
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 tracking-wider">
            Licensed under CC BY-NC-SA
          </span>
        </div>

        {/* Bottom Tier: Copyright & Disclaimers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.06] text-[9.5px] font-tech text-neutral-400 uppercase tracking-[0.16em]">
          <span className="tabular-nums">&copy; {new Date().getFullYear()} ITZFIZZ. ALL RIGHTS RESERVED.</span>
          <span className="text-neutral-400 uppercase">
            PHASES 1 &rarr; 5 COMPLETE // FULL PROTOTYPE
          </span>
        </div>
      </div>
    </footer>
  );
}
