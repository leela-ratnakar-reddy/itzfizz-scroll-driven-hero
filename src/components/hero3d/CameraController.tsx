"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { lerp } from "@/lib/utils";

interface CameraControllerProps {
  progressRef: React.MutableRefObject<number>;
  isMobile?: boolean;
  isReducedMotion?: boolean;
}

export default function CameraController({
  progressRef,
  isMobile = false,
  isReducedMotion = false,
}: CameraControllerProps) {
  const { camera } = useThree();
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.42, 0));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.42, 0));
  const targetPosRef = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame((_, delta) => {
    if (isReducedMotion) {
      camera.position.set(0, isMobile ? 1.4 : 1.35, isMobile ? 5.8 : 5.0);
      camera.lookAt(0, 0.42, 0);
      return;
    }

    const p = Math.max(0, Math.min(1, progressRef.current));

    // Controlled cinematic camera sequence
    let posX: number;
    let posY: number;
    let posZ: number;
    let lookX: number;
    let lookY: number;

    const baseZ = isMobile ? 5.8 : 5.0;

    if (p <= 0.4) {
      // Early sequence: side / three-quarter tracking as car enters
      const t = p / 0.4;
      posX = lerp(-1.1, -0.2, t);
      posY = lerp(1.32, 1.36, t);
      posZ = baseZ + lerp(0.1, 0, t);
      lookX = lerp(-0.4, 0.0, t);
      lookY = 0.42;
    } else if (p <= 0.75) {
      // Middle sequence: car crosses center and typography
      const t = (p - 0.4) / 0.35;
      posX = lerp(-0.2, 0.8, t);
      posY = lerp(1.36, 1.42, t);
      posZ = baseZ + lerp(0, 0.2, t);
      lookX = lerp(0.0, 0.7, t);
      lookY = 0.44;
    } else {
      // Late/final sequence: slight perspective opening toward next section
      const t = (p - 0.75) / 0.25;
      posX = lerp(0.8, 1.6, t);
      posY = lerp(1.42, 1.52, t);
      posZ = baseZ + lerp(0.2, 0.5, t);
      lookX = lerp(0.7, 1.3, t);
      lookY = 0.46;
    }

    targetPosRef.current.set(posX, posY, posZ);
    targetLookAtRef.current.set(lookX, lookY, 0);

    // Smooth cinematic damping
    const dampFactor = Math.min(1, delta * 6);
    camera.position.lerp(targetPosRef.current, dampFactor);
    currentLookAtRef.current.lerp(targetLookAtRef.current, dampFactor);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
}
