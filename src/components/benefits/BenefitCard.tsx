"use client";

import React, { useState, useRef, useCallback } from "react";
import Benefit3DCanvas, { BenefitComponentType } from "./Benefit3DCanvas";
import { isReducedMotion } from "@/lib/animation";

export interface BenefitData {
  number: string;
  title: string;
  description: string;
  isCenter?: boolean;
}

interface BenefitCardProps {
  benefit: BenefitData;
}

export default function BenefitCard({ benefit }: BenefitCardProps) {
  const { number, title, description, isCenter } = benefit;
  const cardRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Map card numbers to specific 3D automotive component types and technical metadata
  const componentConfig: {
    type: BenefitComponentType;
    chamberHeader: string;
    subHeader: string;
    measurement: string;
    materialLabel: string;
  } = (() => {
    switch (number) {
      case "01":
        return {
          type: "aerodynamic",
          chamberHeader: "ITZFIZZ // AERO SYSTEM",
          subHeader: "AERO / 01",
          measurement: "AERO / 42.6°",
          materialLabel: "CARBON COMPOSITE",
        };
      case "02":
        return {
          type: "precision",
          chamberHeader: "ITZFIZZ // PRECISION CORE",
          subHeader: "SYSTEM / 02",
          measurement: "SYSTEM / 18.0°",
          materialLabel: "MACHINED ALLOY",
        };
      case "03":
      default:
        return {
          type: "engine",
          chamberHeader: "ITZFIZZ // PERFORMANCE",
          subHeader: "MOTION / 03",
          measurement: "MOTION / SYSTEM",
          materialLabel: "HIGH PERFORMANCE",
        };
    }
  })();

  // Track cursor position inside card for subtle 3D tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion()) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-3xl overflow-visible flex flex-col justify-between p-8 sm:p-10 transition-all duration-500 border select-none w-full ${
        isCenter
          ? "bg-[#0D1016] border-[#AFDDFF]/35 shadow-2xl shadow-cyan-950/20 lg:-translate-y-4 hover:border-[#62D9FF]/60"
          : "bg-[#07090D] border-white/[0.08] hover:border-white/20"
      }`}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Subtle ambient card glow */}
      <div
        className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 ${
          isCenter
            ? "bg-gradient-to-b from-[#62D9FF]/[0.04] to-transparent opacity-100"
            : "bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100"
        }`}
      />

      {/* ======================================================================= */}
      {/* 3D AUTOMOTIVE DISPLAY CHAMBER (TOP VISUAL AREA)                         */}
      {/* The 3D component physically emerges above the upper chamber border     */}
      {/* ======================================================================= */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-[#11161E] via-[#0B0E14] to-[#07090C] border border-white/[0.08] group-hover:border-[#AFDDFF]/40 mb-8 overflow-visible flex items-center justify-center transition-colors duration-500">
        {/* Subtle engineering grid background */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Chamber Header Label */}
        <div className="absolute top-3.5 inset-x-5 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
            <span className="font-tech text-[9px] text-[#F2F0EA]/[0.58] uppercase">
              {componentConfig.chamberHeader}
            </span>
          </div>
          <span className="font-tech-meta text-[8.5px] text-[#F2F0EA]/[0.42] uppercase hidden sm:inline-block">
            {componentConfig.subHeader}
          </span>
        </div>

        {/* Bottom Chamber Measurement Metadata */}
        <div className="absolute bottom-3.5 inset-x-5 flex items-center justify-between font-tech-meta text-[8px] text-[#F2F0EA]/[0.42] uppercase pointer-events-none z-20">
          <span className="text-[#AFDDFF]/70">{componentConfig.measurement}</span>
          <span>{componentConfig.materialLabel}</span>
        </div>

        {/* ===================================================================== */}
        {/* 3D CANVAS LAYER                                                       */}
        {/* Positioned -top-12 to physically emerge out of the top of the chamber */}
        {/* ===================================================================== */}
        <div className="absolute -top-12 left-0 right-0 h-[calc(100%+36px)] pointer-events-none z-10 overflow-visible">
          <Benefit3DCanvas
            type={componentConfig.type}
            isHovered={isHovered}
            mousePos={mousePos}
          />
        </div>
      </div>

      {/* ======================================================================= */}
      {/* CARD CONTENT LAYER                                                      */}
      {/* ======================================================================= */}
      <div className="flex flex-col relative z-20">
        <div className="flex items-center justify-between text-xs text-[#AFDDFF] uppercase mb-3">
          <span className="font-bold tabular-nums tracking-wider text-sm">{number}</span>
          <span className="font-tech-meta text-[9.5px] text-[#F2F0EA]/[0.45] tracking-[0.18em]">
            BENEFIT // PILLAR
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-[0.08em] mb-3.5 group-hover:text-[#F2F0EA] transition-colors">
          {title}
        </h3>

        <p className="text-sm sm:text-base text-neutral-300 font-normal leading-[1.65] tracking-[0.02em]">
          {description}
        </p>
      </div>

      {/* Bottom subtle accent line & authentication marker */}
      <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-medium text-neutral-400 uppercase">
        <span className="tracking-[0.18em] text-[#F2F0EA]/[0.45] group-hover:text-neutral-300 transition-colors font-tech-meta">
          AUTHENTICATED VALUE
        </span>
        <span className="w-1.5 h-1.5 rounded-none border border-[#AFDDFF]/60 group-hover:bg-[#62D9FF] transition-all" />
      </div>
    </div>
  );
}
