"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BackgroundEnvironmentProps {
  progressRef?: React.MutableRefObject<number>;
  isMobile?: boolean;
}

export default function BackgroundEnvironment({
  progressRef,
}: BackgroundEnvironmentProps) {
  const midgroundRef = useRef<THREE.Group>(null);
  const backgroundRef = useRef<THREE.Group>(null);
  const horizonRef = useRef<THREE.Group>(null);

  // Subtle Parallax Response across layers:
  // Foreground / road: stationary
  // Midground: very subtle movement (~0.24m total travel)
  // Background: slightly slower (~0.48m total travel)
  // Horizon: distant atmospheric shift (~0.72m total travel)
  useFrame(() => {
    const p = progressRef ? progressRef.current : 0;

    if (midgroundRef.current) {
      midgroundRef.current.position.x = THREE.MathUtils.lerp(0.12, -0.12, p);
    }

    if (backgroundRef.current) {
      backgroundRef.current.position.x = THREE.MathUtils.lerp(0.24, -0.24, p);
    }

    if (horizonRef.current) {
      horizonRef.current.position.x = THREE.MathUtils.lerp(0.36, -0.36, p);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================================= */}
      {/* LAYER 1 & 2: EXTENDED HORIZONTAL GROUND FLOOR (Behind North Road Edge)   */}
      {/* Lies flat at Y = -0.04, extending from Z = -3.6 to -11.5 into the fog     */}
      {/* ========================================================================= */}
      <mesh
        receiveShadow
        position={[0, -0.04, -7.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[130, 8.0]} />
        <meshStandardMaterial
          color="#090C10"
          roughness={0.92}
          metalness={0.06}
        />
      </mesh>

      {/* Sparse floor expansion joint lines along X */}
      {[-24, -12, 0, 12, 24].map((xPos) => (
        <mesh
          key={`fjoint-${xPos}`}
          position={[xPos, -0.038, -7.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.025, 8.0]} />
          <meshBasicMaterial color="#12171F" />
        </mesh>
      ))}

      {/* ========================================================================= */}
      {/* LAYER 3: MIDGROUND INDUSTRIAL BARRIERS & STRUCTURES (Z = -5.1 to -5.8)    */}
      {/* Sits between 18% and 26% from screen top; center is open for car clearance*/}
      {/* ========================================================================= */}
      <group ref={midgroundRef}>
        {/* --- Left Midground Industrial Barrier (X = -26 to -8) --- */}
        <group position={[-17, 0.16, -5.1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[18, 0.32, 0.14]} />
            <meshStandardMaterial
              color="#11171C"
              roughness={0.72}
              metalness={0.35}
            />
          </mesh>
          {/* Barrier cap edge reflection line */}
          <mesh position={[0, 0.162, 0.07]}>
            <boxGeometry args={[18, 0.005, 0.012]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.14} />
          </mesh>
        </group>

        {/* --- Right Midground Industrial Barrier (X = +8 to +26) --- */}
        <group position={[17, 0.16, -5.1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[18, 0.32, 0.14]} />
            <meshStandardMaterial
              color="#11171C"
              roughness={0.72}
              metalness={0.35}
            />
          </mesh>
          {/* Barrier cap edge reflection line */}
          <mesh position={[0, 0.162, 0.07]}>
            <boxGeometry args={[18, 0.005, 0.012]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.14} />
          </mesh>
        </group>

        {/* --- Midground Technical Instrumentation Post (X = -13, Z = -5.8) --- */}
        <group position={[-13, 0.35, -5.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.7, 0.12]} />
            <meshStandardMaterial
              color="#131820"
              roughness={0.55}
              metalness={0.45}
            />
          </mesh>
          {/* Indicator Light 1 (3-5px, #AFDDFF, opacity 0.5) */}
          <mesh position={[0, 0.28, 0.065]}>
            <boxGeometry args={[0.035, 0.015, 0.006]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.5} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* LAYER 4: 3 MAJOR BACKGROUND STRUCTURES (Z = -7.0 to -8.5)                 */}
      {/* Populates the upper space (5.5% to 15% from top of screen)               */}
      {/* LEFT: Large rectangular structural frame                                  */}
      {/* CENTER: Distant horizontal gantry (elevated, negative space for car)     */}
      {/* RIGHT: Dark technical wall / support structure                           */}
      {/* ========================================================================= */}
      <group ref={backgroundRef}>
        {/* ======================================================================= */}
        {/* 1. LEFT MAJOR STRUCTURE: Large Dark Rectangular Frame (X = -18, Z = -7.2)*/}
        {/* ======================================================================= */}
        <group position={[-18, 0, -7.2]}>
          {/* Left Vertical Column */}
          <mesh castShadow receiveShadow position={[-6.8, 0.26, 0]}>
            <boxGeometry args={[0.24, 0.56, 0.32]} />
            <meshStandardMaterial
              color="#0D1217"
              roughness={0.78}
              metalness={0.25}
            />
          </mesh>

          {/* Right Vertical Column */}
          <mesh castShadow receiveShadow position={[6.8, 0.26, 0]}>
            <boxGeometry args={[0.24, 0.56, 0.32]} />
            <meshStandardMaterial
              color="#0D1217"
              roughness={0.78}
              metalness={0.25}
            />
          </mesh>

          {/* Top Horizontal Header Beam */}
          <mesh castShadow receiveShadow position={[0, 0.52, 0]}>
            <boxGeometry args={[14.2, 0.12, 0.35]} />
            <meshStandardMaterial
              color="#11171C"
              roughness={0.72}
              metalness={0.28}
            />
          </mesh>

          {/* Recessed Underside Light Strip (#AFDDFF, opacity 0.18) */}
          <mesh position={[0, 0.455, 0.18]}>
            <boxGeometry args={[13.8, 0.008, 0.015]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.18} />
          </mesh>

          {/* Indicator Light 2 (Left Column cap) */}
          <mesh position={[-6.8, 0.52, 0.18]}>
            <boxGeometry args={[0.035, 0.015, 0.008]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.55} />
          </mesh>

          {/* Indicator Light 3 (Right Column cap) */}
          <mesh position={[6.8, 0.52, 0.18]}>
            <boxGeometry args={[0.035, 0.015, 0.008]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.55} />
          </mesh>
        </group>

        {/* ======================================================================= */}
        {/* 2. CENTER MAJOR STRUCTURE: Distant Horizontal Gantry (X = 0, Z = -8.2)   */}
        {/* Elevated at Y = 0.48 (5.5% from screen top) — area below is open         */}
        {/* ======================================================================= */}
        <group position={[0, 0, -8.2]}>
          {/* Main Gantry Horizontal Beam traversing across */}
          <mesh castShadow receiveShadow position={[0, 0.48, 0]}>
            <boxGeometry args={[38, 0.10, 0.30]} />
            <meshStandardMaterial
              color="#0B0F13"
              roughness={0.82}
              metalness={0.2}
            />
          </mesh>

          {/* Recessed Linear Light Strip on Underside (#AFDDFF, opacity 0.15) */}
          <mesh position={[0, 0.425, 0.155]}>
            <boxGeometry args={[37.6, 0.008, 0.015]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.15} />
          </mesh>

          {/* Left Support Column (X = -10, leaving center X in [-6, 6] open) */}
          <mesh castShadow receiveShadow position={[-10, 0.24, 0]}>
            <boxGeometry args={[0.18, 0.50, 0.25]} />
            <meshStandardMaterial
              color="#0A0E13"
              roughness={0.85}
              metalness={0.18}
            />
          </mesh>

          {/* Right Support Column (X = +10, leaving center X in [-6, 6] open) */}
          <mesh castShadow receiveShadow position={[10, 0.24, 0]}>
            <boxGeometry args={[0.18, 0.50, 0.25]} />
            <meshStandardMaterial
              color="#0A0E13"
              roughness={0.85}
              metalness={0.18}
            />
          </mesh>

          {/* Indicator Light 4 (Left support junction) */}
          <mesh position={[-10, 0.48, 0.155]}>
            <boxGeometry args={[0.035, 0.015, 0.008]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.5} />
          </mesh>

          {/* Indicator Light 5 (Right support junction) */}
          <mesh position={[10, 0.48, 0.155]}>
            <boxGeometry args={[0.035, 0.015, 0.008]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.5} />
          </mesh>
        </group>

        {/* ======================================================================= */}
        {/* 3. RIGHT MAJOR STRUCTURE: Dark Technical Wall / Supports (X = 18, Z=-7.5)*/}
        {/* ======================================================================= */}
        <group position={[18, 0, -7.5]}>
          {/* Main Segmented Wall Body */}
          <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[16, 0.44, 0.28]} />
            <meshStandardMaterial
              color="#0D1217"
              roughness={0.78}
              metalness={0.25}
            />
          </mesh>

          {/* Left Vertical Column */}
          <mesh castShadow receiveShadow position={[-7.2, 0.26, 0.05]}>
            <boxGeometry args={[0.26, 0.52, 0.32]} />
            <meshStandardMaterial
              color="#11171C"
              roughness={0.74}
              metalness={0.3}
            />
          </mesh>

          {/* Right Vertical Column */}
          <mesh castShadow receiveShadow position={[7.2, 0.26, 0.05]}>
            <boxGeometry args={[0.26, 0.52, 0.32]} />
            <meshStandardMaterial
              color="#11171C"
              roughness={0.74}
              metalness={0.3}
            />
          </mesh>

          {/* Thin Horizontal Light Strip (#E8F4FA, opacity 0.15) */}
          <mesh position={[0, 0.445, 0.145]}>
            <boxGeometry args={[16, 0.008, 0.015]} />
            <meshBasicMaterial color="#E8F4FA" transparent opacity={0.15} />
          </mesh>

          {/* Indicator Light 6 (Left Column) */}
          <mesh position={[-7.2, 0.48, 0.18]}>
            <boxGeometry args={[0.035, 0.015, 0.008]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.55} />
          </mesh>

          {/* Indicator Light 7 (Right Column) */}
          <mesh position={[7.2, 0.48, 0.18]}>
            <boxGeometry args={[0.035, 0.015, 0.008]} />
            <meshBasicMaterial color="#AFDDFF" transparent opacity={0.55} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* LAYER 5: DISTANT ARCHITECTURAL HORIZON (Z = -10.5m)                       */}
      {/* Sits at 0% to 2% from screen top, establishing atmospheric scale          */}
      {/* Geometric test facility silhouettes + faint rim light + atmospheric glow */}
      {/* ========================================================================= */}
      <group ref={horizonRef} position={[0, 0, -10.5]}>
        {/* Stepped Low Horizon Silhouette Facade */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[120, 0.28, 0.4]} />
          <meshStandardMaterial
            color="#080C10"
            roughness={0.94}
            metalness={0.1}
          />
        </mesh>

        {/* Central Facility Roofline Accent Step */}
        <mesh position={[0, 0.26, -0.05]}>
          <boxGeometry args={[44, 0.10, 0.35]} />
          <meshStandardMaterial
            color="#07090C"
            roughness={0.95}
            metalness={0.08}
          />
        </mesh>

        {/* Thin Horizon Light Runner (#AFDDFF, opacity 0.12) */}
        <mesh position={[0, 0.282, 0.205]}>
          <boxGeometry args={[120, 0.006, 0.015]} />
          <meshBasicMaterial color="#AFDDFF" transparent opacity={0.12} />
        </mesh>

        {/* Soft Atmospheric Horizon Glow Plane (15% brighter than background: #101622) */}
        <mesh position={[0, 0.18, 0.22]}>
          <planeGeometry args={[130, 0.45]} />
          <meshBasicMaterial
            color="#101622"
            transparent
            opacity={0.18}
          />
        </mesh>
      </group>
    </group>
  );
}
