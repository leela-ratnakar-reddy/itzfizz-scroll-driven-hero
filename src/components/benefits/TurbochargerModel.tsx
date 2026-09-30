"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TurbochargerModelProps {
  isHovered: boolean;
  mousePos: { x: number; y: number };
}

export default function TurbochargerModel({ isHovered, mousePos }: TurbochargerModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const impellerRef = useRef<THREE.Group>(null);

  // Precision metallic materials for turbocharger assembly
  const { compressorMat, turbineMat, impellerMat, centerMat, hardwareMat } = useMemo(() => {
    // Machined cast aluminum compressor volute housing (cold side)
    const compressor = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#4B5563"),
      roughness: 0.28,
      metalness: 0.88,
    });

    // Dark nodular cast iron exhaust turbine housing (hot side)
    const turbine = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1E242B"),
      roughness: 0.48,
      metalness: 0.65,
    });

    // Precision CNC machined billet compressor wheel (blades)
    const impeller = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#94A3B8"),
      roughness: 0.2,
      metalness: 0.94,
    });

    // Finned center bearing housing (CHRA)
    const center = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#272E38"),
      roughness: 0.36,
      metalness: 0.78,
    });

    // Actuator canister and stainless hardware
    const hardware = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#CBD5E1"),
      roughness: 0.22,
      metalness: 0.9,
    });

    return { compressorMat: compressor, turbineMat: turbine, impellerMat: impeller, centerMat: center, hardwareMat: hardware };
  }, []);

  // Generate compressor impeller blades (10 curved aerodynamic blades)
  const impellerBlades = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 10; i++) {
      list.push((i / 10) * Math.PI * 2);
    }
    return list;
  }, []);

  // Frame loop for gentle mechanical float + responsive cursor tilt
  useFrame((state) => {
    if (!rootRef.current) return;
    const time = state.clock.getElapsedTime();

    // Base orientation: angled to show intake throat, compressor scroll and hot turbine
    const baseRotX = 0.22;
    const baseRotY = 0.42;
    const baseRotZ = -0.08;

    // Subtle mechanical float
    const floatY = Math.sin(time * 1.15) * 0.038;

    // Cursor influence (desktop)
    const targetRotX = baseRotX + mousePos.y * 0.12;
    const targetRotY = baseRotY + mousePos.x * 0.16;

    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetRotX, 0.08);
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, 0.08);
    rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, baseRotZ, 0.08);

    // Continuous ultra-slow rotation of the compressor impeller wheel
    if (impellerRef.current) {
      impellerRef.current.rotation.z += 0.015;
    }

    // Hover elevation towards viewer
    const targetZ = isHovered ? 0.32 : 0;
    const targetY = (isHovered ? 0.10 : 0) + floatY;
    const baseScale = 0.93; // Subtle ~7% reduction for balanced proportion with center disc
    const targetScale = isHovered ? baseScale * 1.05 : baseScale;

    rootRef.current.position.z = THREE.MathUtils.lerp(rootRef.current.position.z, targetZ, 0.08);
    rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, targetY, 0.08);
    rootRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
  });

  return (
    <group ref={rootRef} position={[0, 0.05, 0]}>
      {/* ======================================================================= */}
      {/* 1. COMPRESSOR HOUSING (COLD SIDE SNAIL / VOLUTE)                       */}
      {/* ======================================================================= */}
      <group position={[0, 0, 0.2]}>
        {/* Main Spiral Volute Outer Torus Ring */}
        <mesh material={compressorMat} castShadow receiveShadow>
          <torusGeometry args={[0.78, 0.36, 24, 36, Math.PI * 1.85]} />
        </mesh>

        {/* Tangential Compressor Discharge Outlet Horn (Shooting upward) */}
        <mesh
          material={compressorMat}
          position={[0.74, 0.72, 0]}
          rotation={[0, 0, -0.2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.26, 0.32, 0.78, 24]} />
        </mesh>

        {/* Outlet Hose Bead Lip */}
        <mesh material={hardwareMat} position={[0.66, 1.1, 0]}>
          <torusGeometry args={[0.27, 0.025, 16, 24]} />
        </mesh>

        {/* Central Inducer Intake Bellmouth Throat */}
        <mesh
          material={compressorMat}
          position={[0, 0, 0.18]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.54, 0.58, 0.32, 32, 1, true]} />
        </mesh>

        {/* Inducer Inlet Flange Rim */}
        <mesh material={hardwareMat} position={[0, 0, 0.34]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.48, 0.58, 32]} />
        </mesh>

        {/* ===================================================================== */}
        {/* COMPRESSOR IMPELLER WHEEL (Inside intake throat)                      */}
        {/* ===================================================================== */}
        <group ref={impellerRef} position={[0, 0, 0.12]}>
          {/* Pointed Aerodynamic Nose Cone Nut */}
          <mesh material={impellerMat} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.12, 0.24, 16]} />
          </mesh>

          {/* 10 Curved Billet Impeller Blades */}
          {impellerBlades.map((angle, idx) => (
            <mesh
              key={idx}
              material={impellerMat}
              position={[Math.cos(angle) * 0.24, Math.sin(angle) * 0.24, -0.04]}
              rotation={[0.3, 0.4, angle]}
              castShadow
            >
              <boxGeometry args={[0.02, 0.28, 0.16]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ======================================================================= */}
      {/* 2. CENTER CARTRIDGE BEARING HOUSING (CHRA)                              */}
      {/* ======================================================================= */}
      <group position={[0, 0, -0.24]}>
        <mesh material={centerMat} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.44, 0.46, 24]} />
        </mesh>

        {/* Cooling Finned Ribs on Center Housing */}
        {[-0.12, 0, 0.12].map((zPos, idx) => (
          <mesh key={idx} material={centerMat} position={[0, 0, zPos]}>
            <torusGeometry args={[0.45, 0.025, 12, 24]} />
          </mesh>
        ))}

        {/* Oil Inlet Boss Port (Top) */}
        <mesh material={hardwareMat} position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 12]} />
        </mesh>
      </group>

      {/* ======================================================================= */}
      {/* 3. EXHAUST TURBINE HOUSING (HOT SIDE)                                   */}
      {/* ======================================================================= */}
      <group position={[0, 0, -0.65]}>
        {/* Cast Turbine Scroll */}
        <mesh material={turbineMat} castShadow receiveShadow>
          <torusGeometry args={[0.7, 0.32, 20, 32, Math.PI * 1.8]} />
        </mesh>

        {/* Exhaust Downpipe Circular Discharge Flange */}
        <mesh material={turbineMat} position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.46, 0.48, 0.24, 24]} />
        </mesh>

        {/* Twin-Scroll Manifold Inlet Flange (Rectangular Port) */}
        <mesh material={turbineMat} position={[-0.72, -0.45, 0]} rotation={[0, 0.3, 0.2]} castShadow>
          <boxGeometry args={[0.36, 0.28, 0.52]} />
        </mesh>
      </group>

      {/* ======================================================================= */}
      {/* 4. BILLET / PNEUMATIC WASTEGATE ACTUATOR CANISTER                       */}
      {/* ======================================================================= */}
      <group position={[-0.92, 0.45, 0]} rotation={[0, 0, -0.45]}>
        {/* Cylindrical Actuator Canister */}
        <mesh material={hardwareMat} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.42, 16]} />
        </mesh>
        {/* Actuator Linkage Rod */}
        <mesh material={hardwareMat} position={[0, -0.42, -0.1]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.48, 8]} />
        </mesh>
      </group>
    </group>
  );
}
