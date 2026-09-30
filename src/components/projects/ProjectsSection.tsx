"use client";

import React from "react";
import ProjectCard, { ProjectData } from "./ProjectCard";

const PROJECTS_DATA: ProjectData[] = [
  {
    id: "proj-1",
    number: "01",
    category: "REAL-TIME SIMULATION",
    name: "Aerodynamic Telemetry Suite",
    description:
      "Interactive GPU-accelerated wind-tunnel visualizer featuring dynamic vector particles and sub-millisecond drag coefficient calculation for automotive platforms.",
    tech: ["Three.js", "WebGL Shaders", "WebSockets", "GLTF Engine"],
    gradient: "bg-gradient-to-br from-[#0c131d] via-[#080d14] to-[#04060a]",
    accent: "#38bdf8",
  },
  {
    id: "proj-2",
    number: "02",
    category: "DIGITAL AUTOMOTIVE",
    name: "Survolt EV Design Archive",
    description:
      "High-fidelity 3D digital twin platform enabling full 360-degree exploded component inspection, aerodynamic surface flow, and real-time livery design.",
    tech: ["React Three Fiber", "PBR Materials", "Post-Processing", "GSAP"],
    gradient: "bg-gradient-to-br from-[#121318] via-[#0b0c10] to-[#050608]",
    accent: "#818cf8",
  },
  {
    id: "proj-3",
    number: "03",
    category: "EMBEDDED UX / AR",
    name: "Spatial Highway Interface",
    description:
      "Next-generation heads-up automotive UI delivering contextual spatial navigation, autonomous drive indicators, and real-time highway lane tracking.",
    tech: ["Next.js", "Tailwind CSS", "Canvas API", "Hardware Telemetry"],
    gradient: "bg-gradient-to-br from-[#0f1715] via-[#090e0d] to-[#040606]",
    accent: "#34d399",
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="relative w-full bg-[#000000] py-32 sm:py-48 px-6 sm:px-12 md:px-24 border-b border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
              <span className="font-tech text-[10px] sm:text-[11px] text-[#F2F0EA]/[0.58]">
                ITZFIZZ // SELECTED WORK // 01 - 03
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[0.10em] text-white uppercase">
              Featured Projects
            </h2>
          </div>
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.16em]">
            Sticky Stack Experience
          </span>
        </div>

        {/* Sticky Stacking Project Cards */}
        <div className="relative flex flex-col items-center">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={PROJECTS_DATA.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
