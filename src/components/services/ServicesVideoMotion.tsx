"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/lib/animation";
import ServicesVideoCanvas from "./ServicesVideoCanvas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LUMEN_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_115057_94c3699b-0fd1-4124-bcf3-3626bb8c1f77.mp4";

interface ServicesVideoMotionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

export default function ServicesVideoMotion({ sectionRef }: ServicesVideoMotionProps) {
  // Outer container wrappers animated by GSAP ScrollTrigger
  const motionWrapRef1 = useRef<HTMLDivElement>(null);
  const motionWrapRef2 = useRef<HTMLDivElement>(null);
  const motionWrapRef3 = useRef<HTMLDivElement>(null);
  const motionWrapRef4 = useRef<HTMLDivElement>(null);

  // Mouse parallax container
  const mouseParallaxRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Motion Choreography
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (isReducedMotion()) {
      // In reduced motion, keep visuals static with subtle elegant ambient opacities
      if (motionWrapRef1.current) gsap.set(motionWrapRef1.current, { opacity: 0.5, x: 0, y: 0 });
      if (motionWrapRef2.current) gsap.set(motionWrapRef2.current, { opacity: 0.4, x: 0, y: 0 });
      if (motionWrapRef3.current) gsap.set(motionWrapRef3.current, { opacity: 0.25, x: 0, y: 0 });
      if (motionWrapRef4.current) gsap.set(motionWrapRef4.current, { opacity: 0.2, x: 0, y: 0 });
      return;
    }

    const rows = section.querySelectorAll(".service-row-wrapper");
    const row1 = rows[0] as HTMLElement;
    const row2 = rows[1] as HTMLElement;
    const row3 = rows[2] as HTMLElement;
    const row5 = rows[4] as HTMLElement;

    const ctx = gsap.context(() => {
      // =======================================================================
      // INSTANCE 1: SERVICE 01 — DIGITAL EXPERIENCES
      // Trajectory: RIGHT → CENTER → SLIGHTLY LEFT (Fore/Midground)
      // =======================================================================
      if (motionWrapRef1.current && row1) {
        gsap.fromTo(
          motionWrapRef1.current,
          {
            x: 180,
            y: -35,
            rotation: 7,
            scale: 0.95,
            opacity: 0,
          },
          {
            x: -90,
            y: 45,
            rotation: -5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: row1,
              start: "top 95%",
              end: "bottom 15%",
              scrub: 0.8,
              onUpdate: (self) => {
                // Bell curve opacity: invisible at edges, peaking at row focus
                const p = self.progress;
                const opacity = Math.sin(p * Math.PI) * 0.82;
                if (motionWrapRef1.current) {
                  motionWrapRef1.current.style.opacity = String(opacity);
                }

                // Interact with nearby technical accents
                const accent = row1.querySelector(".service-tech-accent");
                if (accent) {
                  const focus = Math.max(0, 1 - Math.abs(p - 0.5) * 2.8);
                  (accent as HTMLElement).style.opacity = String(0.3 + focus * 0.7);
                }
              },
            },
          }
        );
      }

      // =======================================================================
      // INSTANCE 2: SERVICE 02 — WEB DEVELOPMENT
      // Trajectory: LEFT → CENTER → RIGHT (Midground counter-motion)
      // =======================================================================
      if (motionWrapRef2.current && row2) {
        gsap.fromTo(
          motionWrapRef2.current,
          {
            x: -210,
            y: 35,
            rotation: -9,
            scale: 0.92,
            opacity: 0,
          },
          {
            x: 130,
            y: -35,
            rotation: 6,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: row2,
              start: "top 95%",
              end: "bottom 15%",
              scrub: 0.8,
              onUpdate: (self) => {
                const p = self.progress;
                const opacity = Math.sin(p * Math.PI) * 0.72;
                if (motionWrapRef2.current) {
                  motionWrapRef2.current.style.opacity = String(opacity);
                }

                const accent = row2.querySelector(".service-tech-accent");
                if (accent) {
                  const focus = Math.max(0, 1 - Math.abs(p - 0.5) * 2.8);
                  (accent as HTMLElement).style.opacity = String(0.3 + focus * 0.7);
                }
              },
            },
          }
        );
      }

      // =======================================================================
      // INSTANCE 3: SERVICE 03 — 3D / INTERACTIVE EXPERIENCES
      // Trajectory: TOP-RIGHT → CENTER → BOTTOM-LEFT (Deep atmospheric diagonal)
      // =======================================================================
      if (motionWrapRef3.current && row3) {
        gsap.fromTo(
          motionWrapRef3.current,
          {
            x: 160,
            y: -120,
            rotation: 12,
            scale: 1.1,
            opacity: 0,
          },
          {
            x: -180,
            y: 110,
            rotation: -10,
            scale: 1.32,
            ease: "none",
            scrollTrigger: {
              trigger: row3,
              start: "top 95%",
              end: "bottom 15%",
              scrub: 0.9,
              onUpdate: (self) => {
                const p = self.progress;
                const opacity = Math.sin(p * Math.PI) * 0.44;
                if (motionWrapRef3.current) {
                  motionWrapRef3.current.style.opacity = String(opacity);
                }

                const accent = row3.querySelector(".service-tech-accent");
                if (accent) {
                  const focus = Math.max(0, 1 - Math.abs(p - 0.5) * 2.8);
                  (accent as HTMLElement).style.opacity = String(0.3 + focus * 0.7);
                }
              },
            },
          }
        );
      }

      // =======================================================================
      // INSTANCE 4: SERVICE 05 — DIGITAL SOLUTIONS (Finale Outro Accent)
      // Trajectory: Horizontal subtle gliding exit in lower-right
      // (Note: Service 04 intentionally has no video — negative space & tech accent)
      // =======================================================================
      if (motionWrapRef4.current && row5) {
        gsap.fromTo(
          motionWrapRef4.current,
          {
            x: 80,
            y: 20,
            rotation: -4,
            scale: 0.85,
            opacity: 0,
          },
          {
            x: -80,
            y: -20,
            rotation: 4,
            scale: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: row5,
              start: "top 95%",
              end: "bottom 10%",
              scrub: 0.8,
              onUpdate: (self) => {
                const p = self.progress;
                const opacity = Math.sin(p * Math.PI) * 0.36;
                if (motionWrapRef4.current) {
                  motionWrapRef4.current.style.opacity = String(opacity);
                }

                const accent = row5.querySelector(".service-tech-accent");
                if (accent) {
                  const focus = Math.max(0, 1 - Math.abs(p - 0.5) * 2.8);
                  (accent as HTMLElement).style.opacity = String(0.3 + focus * 0.7);
                }
              },
            },
          }
        );
      }
    }, section);

    // Subtle desktop mouse parallax with inertia
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    if (window.matchMedia("(pointer: fine)").matches) {
      handleMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        if (e.clientY < rect.top - 200 || e.clientY > rect.bottom + 200) return;

        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;

        if (mouseParallaxRef.current) {
          gsap.to(mouseParallaxRef.current, {
            x: normX * 12,
            y: normY * 8,
            duration: 1.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      ctx.revert();
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [sectionRef]);

  return (
    <div
      ref={mouseParallaxRef}
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ======================================================================= */}
      {/* VIDEO INSTANCE 1: SERVICE 01 (Upper-Right / Fore-Midground)             */}
      {/* ======================================================================= */}
      <div
        ref={motionWrapRef1}
        className="cinematic-flying-visual absolute top-[8%] right-[2%] sm:right-[5%] w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px] will-change-transform pointer-events-none select-none"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <div className="relative w-full h-full animate-aero-float-1 pointer-events-none select-none" style={{ pointerEvents: "none" }}>
          {/* Subtle ice-blue ambient aura */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(98,217,255,0.18)_0%,rgba(175,221,255,0.06)_45%,transparent_72%)] blur-2xl pointer-events-none" />

          {/* Organic feather-masked canvas video */}
          <div
            className="relative w-full h-full overflow-hidden pointer-events-none select-none"
            style={{
              maskImage:
                "radial-gradient(ellipse 66% 62% at 50% 50%, black 28%, rgba(0,0,0,0.85) 55%, transparent 96%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 66% 62% at 50% 50%, black 28%, rgba(0,0,0,0.85) 55%, transparent 96%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          >
            <ServicesVideoCanvas
              src={LUMEN_VIDEO_URL}
              className="filter contrast-[1.08] brightness-[1.02]"
            />
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* VIDEO INSTANCE 2: SERVICE 02 (Left-Center / Midground Counter-Motion)   */}
      {/* ======================================================================= */}
      <div
        ref={motionWrapRef2}
        className="cinematic-flying-visual hidden sm:block absolute top-[28%] left-[1%] sm:left-[4%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] will-change-transform pointer-events-none select-none"
        style={{ opacity: 0, filter: "blur(0.8px)", pointerEvents: "none" }}
      >
        <div className="relative w-full h-full animate-aero-float-2 scale-x-[-1] pointer-events-none select-none" style={{ pointerEvents: "none" }}>
          {/* Subtle soft cyan glow */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(175,221,255,0.15)_0%,rgba(98,217,255,0.05)_45%,transparent_70%)] blur-2xl pointer-events-none" />

          <div
            className="relative w-full h-full overflow-hidden pointer-events-none select-none"
            style={{
              maskImage:
                "radial-gradient(ellipse 65% 60% at 50% 50%, black 26%, rgba(0,0,0,0.82) 54%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 60% at 50% 50%, black 26%, rgba(0,0,0,0.82) 54%, transparent 95%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          >
            <ServicesVideoCanvas
              src={LUMEN_VIDEO_URL}
              className="filter contrast-[1.05]"
            />
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* VIDEO INSTANCE 3: SERVICE 03 (Upper-Center / Deep Background Blur)      */}
      {/* ======================================================================= */}
      <div
        ref={motionWrapRef3}
        className="cinematic-flying-visual absolute top-[48%] right-[8%] sm:right-[15%] w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] lg:w-[620px] lg:h-[620px] will-change-transform pointer-events-none select-none"
        style={{ opacity: 0, filter: "blur(3.5px)", pointerEvents: "none" }}
      >
        <div className="relative w-full h-full animate-aero-float-3 pointer-events-none select-none" style={{ pointerEvents: "none" }}>
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(98,217,255,0.1)_0%,rgba(175,221,255,0.03)_40%,transparent_70%)] blur-3xl pointer-events-none" />

          <div
            className="relative w-full h-full overflow-hidden pointer-events-none select-none"
            style={{
              maskImage:
                "radial-gradient(ellipse 70% 64% at 50% 50%, black 25%, rgba(0,0,0,0.75) 50%, transparent 94%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 64% at 50% 50%, black 25%, rgba(0,0,0,0.75) 50%, transparent 94%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          >
            <ServicesVideoCanvas
              src={LUMEN_VIDEO_URL}
              className="filter contrast-[1.04]"
            />
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* NOTE: SERVICE 04 (UI/UX) HAS NO VIDEO — PURE NEGATIVE SPACE & ACCENTS   */}
      {/* ======================================================================= */}

      {/* ======================================================================= */}
      {/* VIDEO INSTANCE 4: SERVICE 05 (Lower-Right / Finale Outro)               */}
      {/* ======================================================================= */}
      <div
        ref={motionWrapRef4}
        className="cinematic-flying-visual hidden sm:block absolute top-[78%] right-[4%] sm:right-[8%] w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] will-change-transform pointer-events-none select-none"
        style={{ opacity: 0, filter: "blur(1.8px)", pointerEvents: "none" }}
      >
        <div className="relative w-full h-full animate-aero-float-4 pointer-events-none select-none" style={{ pointerEvents: "none" }}>
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(175,221,255,0.08)_0%,rgba(98,217,255,0.02)_40%,transparent_70%)] blur-2xl pointer-events-none" />

          <div
            className="relative w-full h-full overflow-hidden pointer-events-none select-none"
            style={{
              maskImage:
                "radial-gradient(ellipse 64% 60% at 50% 50%, black 28%, rgba(0,0,0,0.8) 52%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 64% 60% at 50% 50%, black 28%, rgba(0,0,0,0.8) 52%, transparent 95%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          >
            <ServicesVideoCanvas
              src={LUMEN_VIDEO_URL}
              className="filter contrast-[1.02]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
