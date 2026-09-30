"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CarModelHandle } from "./CarModel";
import { calculateCarPhysics } from "@/lib/three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollControllerProps {
  containerRef: React.RefObject<HTMLElement>;
  carHandleRef: React.MutableRefObject<CarModelHandle | null>;
  progressRef: React.MutableRefObject<number>;
  startX: number;
  endX: number;
  isReducedMotion: boolean;
  onProgressUpdate?: (progress: number) => void;
}

export default function ScrollController({
  containerRef,
  carHandleRef,
  progressRef,
  startX,
  endX,
  isReducedMotion,
  onProgressUpdate,
}: ScrollControllerProps) {
  const triggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const prevProgressRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isReducedMotion) {
      if (carHandleRef.current?.carGroup) {
        carHandleRef.current.carGroup.position.x = 0;
      }
      progressRef.current = 0.5;
      if (onProgressUpdate) onProgressUpdate(0.5);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const applyProgress = (p: number) => {
      progressRef.current = p;
      if (onProgressUpdate) onProgressUpdate(p);

      const handle = carHandleRef.current;
      if (!handle || !handle.carGroup) return;

      // Position car horizontally along road
      const currentX = startX + p * (endX - startX);
      handle.carGroup.position.x = currentX;

      // Distance traveled
      const distance = currentX - startX;

      // Synchronize wheels with traveled distance
      if (handle.wheelController) {
        handle.wheelController.updateRotation(distance);
      }

      // Calculate subtle realistic car suspension & physics
      const deltaProgress = p - prevProgressRef.current;
      prevProgressRef.current = p;

      const physics = calculateCarPhysics(p, deltaProgress);
      if (handle.setPhysics) {
        handle.setPhysics(physics.suspensionY, physics.pitch, physics.roll);
      }
    };

    // Ensure car starts at initial position
    applyProgress(0);

    // Create pinned ScrollTrigger with scrub: 1.0 (between 0.8 and 1.2 as specified)
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=2800",
      pin: true,
      anticipatePin: 1,
      scrub: 1.0,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        applyProgress(self.progress);
      },
    });

    triggerInstanceRef.current = st;

    return () => {
      if (triggerInstanceRef.current) {
        triggerInstanceRef.current.kill();
        triggerInstanceRef.current = null;
      }
    };
  }, [containerRef, carHandleRef, progressRef, startX, endX, isReducedMotion, onProgressUpdate]);

  return null;
}
