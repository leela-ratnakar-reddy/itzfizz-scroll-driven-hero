"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AeroWingModelProps {
  isHovered: boolean;
  mousePos: { x: number; y: number };
}

export default function AeroWingModel({ isHovered, mousePos }: AeroWingModelProps) {
  const rootRef = useRef<THREE.Group>(null);

  // High-performance procedural carbon-fiber wing materials with refined edge sheen
  const { carbonMat, alloyMat, titaniumMat } = useMemo(() => {
    // Lacquered pre-preg carbon fiber composite (dark carbon with subtle ice-blue specular sheen)
    const carbon = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1A2027"),
      roughness: 0.22,
      metalness: 0.38,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
      sheen: 0.55,
      sheenRoughness: 0.25,
      sheenColor: new THREE.Color("#AFDDFF"),
    });

    // High-contrast CNC machined aluminum mounting pylons & metallic edge highlights
    const alloy = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#64748B"),
      roughness: 0.16,
      metalness: 0.95,
    });

    // Titanium mounting hardware studs & bleeder pins
    const titanium = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E2E8F0"),
      roughness: 0.12,
      metalness: 0.98,
    });

    return { carbonMat: carbon, alloyMat: alloy, titaniumMat: titanium };
  }, []);

  // Frame loop for gentle aerodynamic idle float + responsive cursor tilt
  useFrame((state) => {
    if (!rootRef.current) return;
    const time = state.clock.getElapsedTime();

    // Base orientation
    const baseRotX = 0.22;
    const baseRotY = -0.35;
    const baseRotZ = -0.06;

    // Subtle aerodynamic float
    const floatY = Math.sin(time * 1.2) * 0.04;
    const floatRot = Math.cos(time * 0.9) * 0.02;

    // Cursor influence (desktop)
    const targetRotX = baseRotX + mousePos.y * 0.12;
    const targetRotY = baseRotY + mousePos.x * 0.16 + floatRot;

    // Smooth inertia lerp
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetRotX, 0.08);
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, 0.08);
    rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, baseRotZ, 0.08);

    // Hover elevation towards viewer
    const targetZ = isHovered ? 0.35 : 0;
    const targetY = (isHovered ? 0.12 : 0) + floatY;
    const targetScale = isHovered ? 1.05 : 1.0;

    rootRef.current.position.z = THREE.MathUtils.lerp(rootRef.current.position.z, targetZ, 0.08);
    rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, targetY, 0.08);
    rootRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
  });

  return (
    <group ref={rootRef} position={[0, 0.05, 0]}>
      {/* 1. Main Aerodynamic Airfoil Blade (Curved Swept Carbon Wing) */}
      <mesh material={carbonMat} position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.11, 0.85]} />
      </mesh>

      {/* Trailing Edge Aerodynamic Gurney Flap */}
      <mesh material={carbonMat} position={[0, 0.52, -0.41]} castShadow>
        <boxGeometry args={[3.16, 0.06, 0.025]} />
      </mesh>

      {/* Trailing Edge Metallic Tip Trim */}
      <mesh material={alloyMat} position={[0, 0.55, -0.42]} castShadow>
        <boxGeometry args={[3.16, 0.015, 0.012]} />
      </mesh>

      {/* Aerodynamic Leading Edge Metallic Taper Strip */}
      <mesh material={alloyMat} position={[0, 0.45, 0.43]} castShadow>
        <boxGeometry args={[3.18, 0.04, 0.02]} />
      </mesh>

      {/* 2. Vertical Endplates with Vortex Cutout Details & Metallic Edge Highlights */}
      {/* Left Endplate */}
      <group position={[-1.6, 0.42, 0]}>
        <mesh material={carbonMat} castShadow receiveShadow>
          <boxGeometry args={[0.04, 0.72, 1.08]} />
        </mesh>
        {/* Endplate leading edge metallic highlight */}
        <mesh material={alloyMat} position={[-0.021, 0, 0.54]}>
          <boxGeometry args={[0.005, 0.72, 0.02]} />
        </mesh>
        {/* Endplate lower dive fin */}
        <mesh material={carbonMat} position={[0.04, -0.28, -0.15]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.02, 0.08, 0.5]} />
        </mesh>
      </group>

      {/* Right Endplate */}
      <group position={[1.6, 0.42, 0]}>
        <mesh material={carbonMat} castShadow receiveShadow>
          <boxGeometry args={[0.04, 0.72, 1.08]} />
        </mesh>
        {/* Endplate leading edge metallic highlight */}
        <mesh material={alloyMat} position={[0.021, 0, 0.54]}>
          <boxGeometry args={[0.005, 0.72, 0.02]} />
        </mesh>
        {/* Endplate lower dive fin */}
        <mesh material={carbonMat} position={[-0.04, -0.28, -0.15]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.02, 0.08, 0.5]} />
        </mesh>
      </group>

      {/* 3. Dual CNC Machined Swan-Neck Mounting Pylons / Stanchions */}
      {/* Left Pylon */}
      <group position={[-0.65, 0.05, 0]}>
        {/* Vertical Pylon Blade */}
        <mesh material={alloyMat} position={[0, 0.16, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.56, 0.28]} />
        </mesh>
        {/* Titanium Attachment Bolts */}
        <mesh material={titaniumMat} position={[0.045, 0.35, 0.06]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        </mesh>
        <mesh material={titaniumMat} position={[0.045, 0.35, -0.06]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        </mesh>
        {/* Base Mount Plate */}
        <mesh material={alloyMat} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.16, 0.05, 0.45]} />
        </mesh>
      </group>

      {/* Right Pylon */}
      <group position={[0.65, 0.05, 0]}>
        {/* Vertical Pylon Blade */}
        <mesh material={alloyMat} position={[0, 0.16, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.56, 0.28]} />
        </mesh>
        {/* Titanium Attachment Bolts */}
        <mesh material={titaniumMat} position={[-0.045, 0.35, 0.06]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        </mesh>
        <mesh material={titaniumMat} position={[-0.045, 0.35, -0.06]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        </mesh>
        {/* Base Mount Plate */}
        <mesh material={alloyMat} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.16, 0.05, 0.45]} />
        </mesh>
      </group>

      {/* 4. Lower Aerodynamic Diffuser Base Channels */}
      <group position={[0, -0.22, 0]}>
        {/* Horizontal mounting tray */}
        <mesh material={carbonMat} position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.04, 0.6]} />
        </mesh>
        {/* 4 Lower Vertical Airfoil Strakes */}
        {[-0.6, -0.2, 0.2, 0.6].map((xOffset, idx) => (
          <mesh key={idx} material={carbonMat} position={[xOffset, -0.08, 0]} castShadow>
            <boxGeometry args={[0.025, 0.14, 0.58]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
