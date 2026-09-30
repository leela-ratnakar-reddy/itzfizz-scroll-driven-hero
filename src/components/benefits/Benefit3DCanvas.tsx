"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import AeroWingModel from "./AeroWingModel";
import BrakeDiscModel from "./BrakeDiscModel";
import TurbochargerModel from "./TurbochargerModel";

export type BenefitComponentType = "aerodynamic" | "precision" | "engine";

interface Benefit3DCanvasProps {
  type: BenefitComponentType;
  isHovered: boolean;
  mousePos: { x: number; y: number };
}

export default function Benefit3DCanvas({
  type,
  isHovered,
  mousePos,
}: Benefit3DCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0.25, 4.2],
        fov: 40,
        near: 0.1,
        far: 20,
      }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      className="w-full h-full pointer-events-none select-none"
    >
      {/* ======================================================================= */}
      {/* AUTOMOTIVE STUDIO LIGHTING PIPELINE                                     */}
      {/* Enhanced rim lighting and edge highlights for dark carbon & alloy       */}
      {/* ======================================================================= */}
      {/* 1. Ambient & Hemisphere fill */}
      <ambientLight intensity={0.95} />
      <hemisphereLight
        color="#F8FAFC"
        groundColor="#0B0E13"
        intensity={0.75}
      />

      {/* 2. Soft Key Studio Area Light (Top-Left / Front) */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={type === "aerodynamic" ? 2.9 : 2.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={12}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        shadow-bias={-0.0004}
      />

      {/* 3. Subtle Ice-Blue Cool Rim Light (Rear / Top-Right: #AFDDFF) */}
      <directionalLight
        position={[4, 5, -4]}
        color="#AFDDFF"
        intensity={type === "aerodynamic" ? 2.7 : 1.9}
      />

      {/* 4. Opposing Ice-Blue Silhouette Rim Light (Rear / Top-Left: #62D9FF) */}
      <directionalLight
        position={[-4, 4.5, -3.5]}
        color="#62D9FF"
        intensity={type === "aerodynamic" ? 2.3 : 1.3}
      />

      {/* 5. Opposing Warm Graphite Accent Light (Front / Bottom-Left) */}
      <directionalLight
        position={[-4, -1, 3]}
        color="#E2E8F0"
        intensity={0.75}
      />

      {/* ======================================================================= */}
      {/* 3D AUTOMOTIVE COMPONENT & CONTACT SHADOW                                */}
      {/* ======================================================================= */}
      <Suspense fallback={null}>
        {type === "aerodynamic" && (
          <AeroWingModel isHovered={isHovered} mousePos={mousePos} />
        )}
        {type === "precision" && (
          <BrakeDiscModel isHovered={isHovered} mousePos={mousePos} />
        )}
        {type === "engine" && (
          <TurbochargerModel isHovered={isHovered} mousePos={mousePos} />
        )}

        {/* Soft Contact Shadow anchoring the component to the chamber floor */}
        <ContactShadows
          position={[0, -1.18, 0]}
          opacity={isHovered ? 0.88 : 0.65}
          scale={3.6}
          blur={1.8}
          far={2.2}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
