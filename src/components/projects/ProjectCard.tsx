"use client";

import React, { useRef, useState, useEffect } from "react";
import { isReducedMotion } from "@/lib/animation";

export interface ProjectData {
  id: string;
  number: string;
  category: string;
  name: string;
  description: string;
  tech: string[];
  gradient: string;
  accent: string;
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  total: number;
}

export default function ProjectCard({
  project,
  index,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Mouse parallax interpolation refs (desktop only)
  const [isDesktop, setIsDesktop] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024 && !isReducedMotion());
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const el = cardRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mousePos.current = { x: x * 15, y: y * 15 };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: 0, y: 0 };
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    const updateParallax = () => {
      // Damped interpolation: current += (target - current) * 0.08
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.08;

      if (visualRef.current) {
        visualRef.current.style.transform = `perspective(1350px) rotateX(${
          -currentPos.current.y
        }deg) rotateY(${currentPos.current.x}deg) translateZ(10px)`;
      }

      rafId.current = requestAnimationFrame(updateParallax);
    };

    rafId.current = requestAnimationFrame(updateParallax);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isDesktop]);

  return (
    <div
      ref={cardRef}
      // Sticky stacking container
      className="sticky top-24 sm:top-28 w-full rounded-3xl bg-[#090a0d] border border-white/[0.12] p-6 sm:p-10 md:p-12 shadow-2xl transition-all duration-300 overflow-hidden mb-12"
      style={{
        zIndex: index + 1,
      }}
    >
      {/* Subtle top inner glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      {/* TOP: Number, Category, Project Name, View Project */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-lg sm:text-xl font-bold tabular-nums text-[#AFDDFF]">
            {project.number}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.18em] text-neutral-400 uppercase font-tech-meta">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-base sm:text-lg font-bold text-white uppercase tracking-[0.06em]">
            {project.name}
          </span>
          <button className="text-[10px] font-medium tracking-[0.14em] text-white hover:text-[#AFDDFF] border border-white/20 hover:border-[#AFDDFF] px-3.5 py-1.5 rounded uppercase transition-all">
            VIEW PROJECT
          </button>
        </div>
      </div>

      {/* BODY: Visual container with 3D perspective + Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-center">
        {/* Large Visual */}
        <div className="lg:col-span-8 overflow-hidden rounded-2xl">
          <div
            ref={visualRef}
            className={`w-full h-64 sm:h-80 md:h-96 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-transform duration-100 ease-out border border-white/[0.08] ${project.gradient}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Visual HUD overlay */}
            <div className="flex items-center justify-between text-[10px] font-medium text-[#AFDDFF]/80 tracking-[0.16em] tabular-nums font-tech">
              <span>ACTIVE TELEMETRY // 60FPS</span>
              <span>RENDER // THREE.JS</span>
            </div>

            {/* Geometric center graphic representation */}
            <div className="self-center my-auto flex flex-col items-center">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-[#AFDDFF]/20 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-[#AFDDFF]/40 animate-spin" style={{ animationDuration: "20s" }} />
                <span className="absolute text-[11px] sm:text-xs font-bold text-white tracking-widest tabular-nums">
                  {project.number}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-medium text-neutral-400 tabular-nums font-tech-meta">
              <span>LATENCY: 0.8MS</span>
              <span>SYSTEM: OK</span>
            </div>
          </div>
        </div>

        {/* Secondary Info & Project Description */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="text-[10px] font-medium tracking-[0.18em] text-[#AFDDFF] uppercase font-tech">
            SPECIFICATION // EXECUTION
          </div>

          <p className="text-sm sm:text-base text-neutral-300 font-normal leading-[1.65] tracking-[0.02em]">
            {project.description}
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-400 flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-medium tracking-[0.12em]">
              <span className="text-neutral-400">FRAMEWORK</span>
              <span className="text-white">HARDWARE ACCELERATED</span>
            </div>
            <div className="flex justify-between text-[10px] font-medium tracking-[0.12em]">
              <span className="text-neutral-400">STATUS</span>
              <span className="text-[#AFDDFF]">ACTIVE PRODUCTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Technology & Category Labels */}
      <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[9.5px] font-tech tracking-[0.14em] uppercase bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>

        <span className="text-[9.5px] font-tech text-neutral-400 tracking-[0.16em] uppercase tabular-nums">
          ITZFIZZ REPOSITORY // 2026
        </span>
      </div>
    </div>
  );
}
