"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./Scene";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const carRootRef = useRef<THREE.Group>(null);
  const progressRef = useRef<number>(0);
  const velocityIndicatorRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [carScale, setCarScale] = useState(118);
  const [entranceStage, setEntranceStage] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCarScale(mobile ? 68 : 118);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    const containerEl = containerRef.current;
    const pinEl = pinRef.current;
    if (!containerEl || !pinEl) return;

    // Movement progression:
    // Desktop:
    // p = 0.00: Car entering on left (startX = -6.5m)
    // p = 0.25: Complete car visible around left-center (-3.0m)
    // p = 0.50: Complete car crossing center (+0.5m, crossing WELCOME [CAR] ITZFIZZ)
    // p = 0.75: Car around right-center (+4.0m)
    // p = 1.00: Car exits right (+7.5m)
    const mobile = window.innerWidth < 768;
    const startX = mobile ? -3.8 : -6.5;
    const endX = mobile ? 4.4 : 7.5;

    // Initial setup: Car starts slightly offset to the left for the 500ms settlement
    const initialEntryOffset = prefersReducedMotion ? 0 : 0.4;
    if (carRootRef.current) {
      carRootRef.current.position.set(startX - initialEntryOffset, 0, 0.6);
    }
    progressRef.current = 0;

    // =========================================================================
    // 1. CHOREOGRAPHED ENTRANCE SEQUENCE (cubic-bezier(0.16, 1, 0.3, 1))
    // 0ms: background/environment visible
    // 150ms: ITZFIZZ brand/technical label fades in
    // 300ms: WELCOME ITZFIZZ headline begins reveal
    // 500ms: car smoothly settles into initial position
    // 650ms: performance metrics stagger in
    // 800–1200ms: technical accents finish appearing
    // =========================================================================
    const timers: NodeJS.Timeout[] = [];

    if (prefersReducedMotion) {
      setEntranceStage(5);
      if (carRootRef.current) {
        carRootRef.current.position.x = startX;
      }
    } else {
      // 150ms: brand label
      timers.push(setTimeout(() => setEntranceStage((s) => Math.max(s, 1)), 150));
      // 300ms: headline reveal begins
      timers.push(setTimeout(() => setEntranceStage((s) => Math.max(s, 2)), 300));
      // 500ms: car settlement
      timers.push(
        setTimeout(() => {
          setEntranceStage((s) => Math.max(s, 3));
          if (carRootRef.current && progressRef.current === 0) {
            gsap.to(carRootRef.current.position, {
              x: startX,
              duration: 0.75,
              ease: "power3.out", // Mathematically matches cubic-bezier(0.16, 1, 0.3, 1)
            });
          }
        }, 500)
      );
      // 650ms: metrics stagger in
      timers.push(setTimeout(() => setEntranceStage((s) => Math.max(s, 4)), 650));
      // 800-1200ms: technical accents complete
      timers.push(setTimeout(() => setEntranceStage((s) => Math.max(s, 5)), 800));
    }

    // =========================================================================
    // 2. PRIMARY SCROLL-DRIVEN MOVEMENT VIA GSAP SCROLLTRIGGER
    // =========================================================================
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerEl,
        start: "top top",
        end: "bottom bottom",
        pin: pinEl,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          // 1. Horizontal vehicle progression strictly along X from LEFT -> RIGHT
          if (carRootRef.current) {
            const currentX = THREE.MathUtils.lerp(startX, endX, p);
            carRootRef.current.position.x = currentX;

            // 2. Subtle physical chassis dynamics:
            if (!prefersReducedMotion) {
              // Very subtle suspension deflection (±12mm) as vehicle rolls across asphalt
              const suspensionY = Math.sin(p * 26) * 0.012;
              carRootRef.current.position.y = suspensionY;

              // Subtle body tilt / pitch during travel (~0.3 deg)
              const pitch = Math.sin(p * 18) * 0.005;
              carRootRef.current.rotation.z = -pitch;
            }
          }

          // 3. Subtle Scroll-Velocity Reactive Telemetry Feedback:
          // Directly modifies transform scaleX via ref (0 React re-renders, 60 FPS)
          if (velocityIndicatorRef.current) {
            const velocity = Math.abs(self.getVelocity() || 0);
            // Baseline 0.15 at rest -> bursts up to 1.0 at high scroll velocity
            const impulse = Math.min(1.0, 0.15 + (velocity / 2200) * 0.85);
            velocityIndicatorRef.current.style.transform = `scaleX(${impulse.toFixed(3)})`;
          }
        },
      });
    }, containerEl);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    timers.push(refreshTimer);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", checkViewport);
      ctx.revert();
    };
  }, []);

  // Standardized easing transition style string
  const easeTransition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <section
      ref={containerRef}
      id="hero-track"
      className="relative w-full bg-[#080A0D] select-none"
      style={{ height: "320vh" }}
    >
      {/* Sticky Pinned Cinematic Viewport */}
      <div
        ref={pinRef}
        className="sticky top-0 w-full h-screen flex flex-col justify-between items-center overflow-hidden bg-[#080A0D]"
      >
        {/* Real Three.js Canvas Layer - Spans Full Viewport (0ms load) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Scene
            carRootRef={carRootRef}
            carScale={carScale}
            isMobile={isMobile}
            progressRef={progressRef}
          />
        </div>

        {/* Subtle Top Ambient Vignette Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#080A0D]/70 to-transparent pointer-events-none z-10" />

        {/* =================================================================== */}
        {/* 150ms: UPPER-LEFT AUTOMOTIVE ENGINEERING DESIGNATION                */}
        {/* =================================================================== */}
        <div
          className="absolute top-24 left-6 sm:left-12 md:left-24 z-20 pointer-events-none select-none flex flex-col gap-1.5"
          style={{
            opacity: entranceStage >= 1 ? 1 : 0,
            transform: entranceStage >= 1 ? "translateY(0)" : "translateY(12px)",
            transition: easeTransition,
          }}
        >
          {/* Primary Brand Label: [ICE-BLUE SQUARE] ITZFIZZ // AUTOMOTIVE SYSTEM */}
          <div className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
            <span className="font-tech text-[9px] sm:text-[10px] md:text-[11px] text-[#F2F0EA]/[0.58]">
              ITZFIZZ // AUTOMOTIVE SYSTEM
            </span>
          </div>

          {/* Secondary Metadata: ────── AERO / 01 */}
          <div className="flex items-center gap-2 pl-[13px]">
            <span className="w-4 h-[1px] bg-white/[0.08]" />
            <span className="font-tech-meta text-[8px] sm:text-[9px] md:text-[10px] text-[#F2F0EA]/[0.42]">
              AERO / 01
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 800ms: UPPER-RIGHT SECONDARY FACILITY TELEMETRY ACCENT              */}
        {/* =================================================================== */}
        <div
          className="hidden sm:flex absolute top-24 right-6 sm:right-12 md:right-24 z-20 pointer-events-none select-none flex-col items-end gap-1.5"
          style={{
            opacity: entranceStage >= 5 ? 1 : 0,
            transform: entranceStage >= 5 ? "translateY(0)" : "translateY(12px)",
            transition: easeTransition,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-tech text-[9px] sm:text-[10px] md:text-[11px] text-[#F2F0EA]/[0.55]">
              MOTION // 02
            </span>
            <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
          </div>
          <div className="flex items-center gap-2 pr-[13px]">
            <span className="font-tech-meta text-[8px] sm:text-[9px] md:text-[10px] text-[#F2F0EA]/[0.40]">
              REAL-TIME / 3D
            </span>
            <span className="w-4 h-[1px] bg-white/[0.08]" />
          </div>
        </div>

        {/* =================================================================== */}
        {/* 950ms: MID-UPPER FACILITY CALIBRATION MARKER                        */}
        {/* =================================================================== */}
        <div
          className="hidden lg:flex absolute top-36 left-[30%] z-20 pointer-events-none select-none items-center gap-2 font-tech-meta text-[9px] text-[#F2F0EA]/[0.38] tracking-[0.20em]"
          style={{
            opacity: entranceStage >= 5 ? 1 : 0,
            transform: entranceStage >= 5 ? "translateY(0)" : "translateY(10px)",
            transition: easeTransition,
          }}
        >
          <span className="w-[4px] h-[4px] rounded-[1px] bg-[#AFDDFF]/70" />
          <span>FLOW // 03</span>
          <span className="w-3 h-[1px] bg-white/[0.08]" />
          <span>DYNAMICS / 04</span>
        </div>

        {/* =================================================================== */}
        {/* 1100ms: SUBTLE RIGHT FACILITY BADGE                                 */}
        {/* =================================================================== */}
        <div
          className="hidden lg:flex absolute top-36 right-[32%] z-20 pointer-events-none select-none items-center gap-2 font-tech-meta text-[8.5px] text-[#F2F0EA]/[0.35] tracking-[0.20em]"
          style={{
            opacity: entranceStage >= 5 ? 1 : 0,
            transform: entranceStage >= 5 ? "translateY(0)" : "translateY(10px)",
            transition: easeTransition,
          }}
        >
          <span>TEST FACILITY // R&amp;D</span>
          <span className="w-1.5 h-1.5 rounded-full border border-[#AFDDFF]/40" />
        </div>

        {/* Blueprint Marks (1200ms) */}
        <span
          className="hidden lg:block absolute top-36 left-[20%] z-20 pointer-events-none text-white/[0.12] text-[10px] font-tech select-none"
          style={{
            opacity: entranceStage >= 5 ? 1 : 0,
            transition: easeTransition,
          }}
        >
          +
        </span>
        <span
          className="hidden lg:block absolute top-40 right-[22%] z-20 pointer-events-none text-white/[0.12] text-[10px] font-tech select-none"
          style={{
            opacity: entranceStage >= 5 ? 1 : 0,
            transition: easeTransition,
          }}
        >
          +
        </span>

        {/* Top Spacer for Persistent Navigation */}
        <div className="h-20 w-full pointer-events-none z-10" />

        {/* Center Flex Spacer */}
        <div className="flex-1 w-full pointer-events-none" />

        {/* =================================================================== */}
        {/* 650ms: MINIMALIST TELEMETRY FOOTER & STAGGERED METRICS              */}
        {/* Understated luxury automotive footer                                */}
        {/* =================================================================== */}
        <div className="relative z-20 w-full px-6 sm:px-12 md:px-24 pb-8 flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-none select-none border-t border-white/[0.05] bg-gradient-to-t from-[#080A0D] to-transparent">
          {/* Left: Engineering Status & Velocity Impulse Line (Requirement 13 & 16) */}
          <div
            className="flex items-center gap-3 font-tech text-[9.5px] md:text-[10.5px] text-[#F2F0EA]/[0.55]"
            style={{
              opacity: entranceStage >= 4 ? 1 : 0,
              transform: entranceStage >= 4 ? "translateY(0)" : "translateY(14px)",
              transition: easeTransition,
            }}
          >
            <span className="w-[5px] h-[5px] rounded-[1px] bg-[#AFDDFF] flex-shrink-0" />
            <span>REAL-TIME 3D TELEMETRY // 60 FPS</span>

            {/* Subtle Scroll-Reactive Velocity Impulse Line (Requirement 16) */}
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-white/[0.08]">
              <span className="text-[7.5px] font-tech text-[#AFDDFF]/60 tracking-wider">V-SYNC</span>
              <div className="w-12 h-1 bg-white/[0.08] rounded-full overflow-hidden relative">
                <div
                  ref={velocityIndicatorRef}
                  className="h-full bg-gradient-to-r from-[#AFDDFF]/50 to-[#AFDDFF] rounded-full origin-left will-change-transform"
                  style={{
                    transform: "scaleX(0.15)",
                    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Center: Preserved Staggered Metrics (95%, 87%, 92%) - Racing Telemetry hierarchy */}
          <div className="flex items-center gap-7 sm:gap-10 md:gap-12">
            {/* Metric 1 (650ms) */}
            <div
              className="flex items-baseline gap-2.5"
              style={{
                opacity: entranceStage >= 4 ? 1 : 0,
                transform: entranceStage >= 4 ? "translateY(0)" : "translateY(14px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0ms",
              }}
            >
              <span className="text-white font-bold tabular-nums tracking-tight text-xl sm:text-2xl md:text-3xl">
                95%
              </span>
              <span className="font-tech-meta text-[8px] sm:text-[8.5px] md:text-[9.5px] tracking-[0.16em] text-[#F2F0EA]/[0.48]">
                PERFORMANCE
              </span>
            </div>

            {/* Metric 2 (750ms: delay 100ms) */}
            <div
              className="flex items-baseline gap-2.5"
              style={{
                opacity: entranceStage >= 4 ? 1 : 0,
                transform: entranceStage >= 4 ? "translateY(0)" : "translateY(14px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 100ms",
              }}
            >
              <span className="text-white font-bold tabular-nums tracking-tight text-xl sm:text-2xl md:text-3xl">
                87%
              </span>
              <span className="font-tech-meta text-[8px] sm:text-[8.5px] md:text-[9.5px] tracking-[0.16em] text-[#F2F0EA]/[0.48]">
                IMMERSION
              </span>
            </div>

            {/* Metric 3 (850ms: delay 200ms) */}
            <div
              className="flex items-baseline gap-2.5"
              style={{
                opacity: entranceStage >= 4 ? 1 : 0,
                transform: entranceStage >= 4 ? "translateY(0)" : "translateY(14px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
              }}
            >
              <span className="text-white font-bold tabular-nums tracking-tight text-xl sm:text-2xl md:text-3xl">
                92%
              </span>
              <span className="font-tech-meta text-[8px] sm:text-[8.5px] md:text-[9.5px] tracking-[0.16em] text-[#F2F0EA]/[0.48]">
                IMPACT
              </span>
            </div>
          </div>

          {/* Right: Scroll Indicator (900ms) */}
          <div
            className="hidden md:flex items-center gap-2.5 font-tech text-[9.5px] text-[#F2F0EA]/[0.45]"
            style={{
              opacity: entranceStage >= 4 ? 1 : 0,
              transform: entranceStage >= 4 ? "translateY(0)" : "translateY(14px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 250ms",
            }}
          >
            <span>SCROLL TO DRIVE</span>
            <div className="w-3.5 h-5 rounded-full border border-white/20 flex items-start justify-center p-0.5">
              <div className="w-1 h-1.5 bg-[#AFDDFF] rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
