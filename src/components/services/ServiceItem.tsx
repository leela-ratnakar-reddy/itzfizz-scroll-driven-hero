"use client";

import React, { useState } from "react";

export interface ServiceData {
  number: string;
  title: string;
  description: string;
  tags: string[];
  techCode?: string;
  techLabel?: string;
}

interface ServiceItemProps {
  service: ServiceData;
  index: number;
}

export default function ServiceItem({ service, index }: ServiceItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Professional automotive technical metadata per service index
  const techMarkers = [
    {
      label: "ITZFIZZ // AERO SYSTEM",
      code: "AERO / 01",
    },
    {
      label: "ITZFIZZ // WEB PLATFORM",
      code: "SYSTEM / 02",
    },
    {
      label: "ITZFIZZ // 3D COMPUTING",
      code: "MOTION / 03",
    },
    {
      label: "ITZFIZZ // DESIGN SYSTEM",
      code: "PHYSICAL WEBGL / 04",
    },
    {
      label: "ITZFIZZ // SCALABLE ARCHITECTURE",
      code: "PERFORMANCE / 05",
    },
  ];

  const marker = techMarkers[index] || techMarkers[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border-b border-white/[0.08] py-12 sm:py-16 transition-colors duration-500 overflow-hidden"
    >
      {/* Subtle ice-blue ambient hover wash behind row content */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-[#62D9FF]/[0.03] via-[#AFDDFF]/[0.015] to-transparent pointer-events-none transition-opacity duration-500 hidden md:block ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Professional Automotive Technical Engineering Accent Line */}
      <div className="service-tech-accent mb-6 flex items-center justify-between text-[10px] font-tech text-[#F2F0EA]/[0.58] transition-all duration-500 select-none pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
          <span className="text-[#F2F0EA]/[0.58] group-hover:text-[#AFDDFF] transition-colors">
            {marker.label}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-tech-meta text-[9.5px] text-[#F2F0EA]/[0.42] group-hover:text-[#AFDDFF]/70 transition-colors">
          <span className="w-4 h-[1px] bg-white/[0.08]" />
          <span>{marker.code}</span>
        </div>
      </div>

      <div className="relative z-20 flex flex-col md:flex-row md:items-baseline justify-between gap-6 sm:gap-8">
        {/* Large Number + Title */}
        <div className="flex items-baseline gap-6 sm:gap-10 md:w-3/5">
          <span
            className={`service-num text-xl sm:text-2xl font-bold tabular-nums text-neutral-400 group-hover:text-[#AFDDFF] transition-all duration-300 ${
              isHovered ? "md:translate-x-2 text-[#AFDDFF]" : ""
            }`}
          >
            {service.number}
          </span>
          <h3
            className={`service-title text-xl sm:text-2xl md:text-3xl font-bold text-[#F2F0EA] uppercase transition-all duration-300 tracking-[0.06em] ${
              isHovered
                ? "text-[#AFDDFF]"
                : ""
            }`}
          >
            {service.title}
          </h3>
        </div>

        {/* Description & Tags */}
        <div className="md:w-2/5 flex flex-col gap-4 pl-12 md:pl-0">
          <p className="service-desc text-sm sm:text-base text-neutral-300 font-normal leading-[1.65] tracking-[0.02em]">
            {service.description}
          </p>

          <div className="service-tags flex flex-wrap gap-2 pt-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9.5px] font-medium tracking-[0.14em] uppercase bg-white/[0.03] border border-white/[0.08] group-hover:border-[#AFDDFF]/30 px-2.5 py-1 rounded text-neutral-400 group-hover:text-neutral-200 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
