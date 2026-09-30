"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BrakeDiscModelProps {
  isHovered: boolean;
  mousePos: { x: number; y: number };
}

export default function BrakeDiscModel({ isHovered, mousePos }: BrakeDiscModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Group>(null);

  // Precision mechanical materials for carbon-ceramic / steel brake assembly
  const { rotorMat, hatMat, caliperMat, hardwareMat, drillMat } = useMemo(() => {
    // Brushed carbon-ceramic / steel rotor friction face
    const rotor = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#434C58"),
      roughness: 0.28,
      metalness: 0.92,
    });

    // Hard-anodized dark graphite center bell / hat
    const hat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1B2027"),
      roughness: 0.35,
      metalness: 0.82,
    });

    // Monobloc high-performance caliper in dark graphite automotive finish
    const caliper = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1E242C"),
      roughness: 0.38,
      metalness: 0.72,
    });

    // Titanium mounting hardware and bleeder screws
    const hardware = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#CBD5E1"),
      roughness: 0.18,
      metalness: 0.95,
    });

    // Dark recessed cross-drilled hole material
    const drill = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#0A0C0F"),
    });

    return { rotorMat: rotor, hatMat: hat, caliperMat: caliper, hardwareMat: hardware, drillMat: drill };
  }, []);

  // Generate radial arrays of cross-drilled holes and cooling vanes
  const { drilledHoles, rotorVanes, bobbins } = useMemo(() => {
    // 1. Cross-drilled cooling holes across rotor face
    const holes: [number, number][] = [];
    const radii = [0.95, 1.08, 1.22];
    radii.forEach((r, rIdx) => {
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (rIdx * 0.12);
        holes.push([Math.cos(angle) * r, Math.sin(angle) * r]);
      }
    });

    // 2. Internal directional cooling vanes (circumferential)
    const vanes: number[] = [];
    for (let i = 0; i < 28; i++) {
      vanes.push((i / 28) * Math.PI * 2);
    }

    // 3. Floating rotor drive bobbins / pins
    const bobbinList: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      bobbinList.push([Math.cos(angle) * 0.78, Math.sin(angle) * 0.78]);
    }

    return { drilledHoles: holes, rotorVanes: vanes, bobbins: bobbinList };
  }, []);

  // Frame loop for gentle mechanical float + responsive cursor tilt
  useFrame((state) => {
    if (!rootRef.current) return;
    const time = state.clock.getElapsedTime();

    // Base orientation: angled forward to display rotor face and 6-piston caliper
    const baseRotX = 0.24;
    const baseRotY = -0.32;
    const baseRotZ = 0.05;

    // Subtle mechanical float
    const floatY = Math.sin(time * 1.1) * 0.035;

    // Cursor influence (desktop)
    const targetRotX = baseRotX + mousePos.y * 0.14;
    const targetRotY = baseRotY + mousePos.x * 0.18;

    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetRotX, 0.08);
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, 0.08);
    rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, baseRotZ, 0.08);

    // Hover elevation towards viewer (largest component, comfortably centered)
    const targetZ = isHovered ? 0.32 : 0;
    const targetY = (isHovered ? 0.08 : 0) + floatY;
    const baseScale = 0.94; // Reduced by ~17.5% from 1.14 to stay comfortably inside chamber
    const targetScale = isHovered ? baseScale * 1.05 : baseScale;

    rootRef.current.position.z = THREE.MathUtils.lerp(rootRef.current.position.z, targetZ, 0.08);
    rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, targetY, 0.08);
    rootRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
  });

  return (
    <group ref={rootRef} position={[0, 0.04, 0]}>
      {/* ======================================================================= */}
      {/* 1. VENTILATED BRAKE ROTOR ASSEMBLY                                      */}
      {/* ======================================================================= */}
      <group ref={rotorRef}>
        {/* Front Friction Plate */}
        <mesh material={rotorMat} position={[0, 0, 0.06]} castShadow receiveShadow>
          <ringGeometry args={[0.82, 1.34, 48]} />
        </mesh>

        {/* Rear Friction Plate */}
        <mesh material={rotorMat} position={[0, 0, -0.06]} castShadow receiveShadow>
          <ringGeometry args={[0.82, 1.34, 48]} />
        </mesh>

        {/* Outer Cylinder Rim / Edge */}
        <mesh material={rotorMat} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.34, 1.34, 0.12, 48, 1, true]} />
        </mesh>

        {/* Inner Cylinder Rim */}
        <mesh material={hatMat} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 0.13, 36, 1, true]} />
        </mesh>

        {/* Internal Directional Cooling Vanes (between front and rear plates) */}
        {rotorVanes.map((angle, idx) => (
          <mesh
            key={idx}
            material={rotorMat}
            position={[Math.cos(angle) * 1.08, Math.sin(angle) * 1.08, 0]}
            rotation={[0, 0, angle + 0.35]}
          >
            <boxGeometry args={[0.02, 0.45, 0.1]} />
          </mesh>
        ))}

        {/* Cross-Drilled Holes Pattern (Front face) */}
        {drilledHoles.map(([hx, hy], idx) => (
          <mesh key={idx} material={drillMat} position={[hx, hy, 0.062]}>
            <circleGeometry args={[0.018, 10]} />
          </mesh>
        ))}

        {/* ===================================================================== */}
        {/* 2. RECESSED ROTOR HAT / CENTER HUB BELL                               */}
        {/* ===================================================================== */}
        {/* Hat Flange Step */}
        <mesh material={hatMat} position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.82, 0.72, 0.14, 36]} />
        </mesh>

        {/* Center Recessed Hat Face */}
        <mesh material={hatMat} position={[0, 0, 0.11]} castShadow>
          <circleGeometry args={[0.72, 36]} />
        </mesh>

        {/* Centerlock Spindle Nut (Precision anodized lock ring) */}
        <group position={[0, 0, 0.18]}>
          <mesh material={caliperMat} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.28, 0.14, 24]} />
          </mesh>
          {/* Anodized Ice-Cyan Lock Ring */}
          <mesh position={[0, 0, 0.075]}>
            <ringGeometry args={[0.16, 0.25, 24]} />
            <meshStandardMaterial color="#62D9FF" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Central Spindle Bore */}
          <mesh material={drillMat} position={[0, 0, 0.076]}>
            <circleGeometry args={[0.15, 20]} />
          </mesh>
        </group>

        {/* Floating Rotor Drive Bobbins / Titanium Drive Pins */}
        {bobbins.map(([bx, by], idx) => (
          <mesh
            key={`pin-${idx}`}
            material={hardwareMat}
            position={[bx, by, 0.08]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.032, 0.032, 0.05, 12]} />
          </mesh>
        ))}
      </group>

      {/* ======================================================================= */}
      {/* 3. MONOBLOC 6-PISTON BRAKE CALIPER ASSEMBLY                             */}
      {/* Positioned at upper-right quadrant of disc, spanning across rotor face  */}
      {/* ======================================================================= */}
      <group position={[0.78, 0.78, 0]} rotation={[0, 0, -Math.PI / 4]}>
        {/* Main Caliper Body Bridge (Upper shell) */}
        <mesh material={caliperMat} position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.62, 0.28, 0.44]} />
        </mesh>

        {/* Caliper Front Half (Outer 3 Pistons) */}
        <mesh material={caliperMat} position={[0, 0.08, 0.16]} castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.42, 0.12]} />
        </mesh>

        {/* Caliper Rear Half (Inner 3 Pistons) */}
        <mesh material={caliperMat} position={[0, 0.08, -0.16]} castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.42, 0.12]} />
        </mesh>

        {/* 3 Outer Piston Cylinder Boss Caps */}
        {[-0.18, 0, 0.18].map((px, idx) => (
          <mesh
            key={`piston-${idx}`}
            material={caliperMat}
            position={[px, 0.08, 0.23]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.075, 0.075, 0.03, 16]} />
          </mesh>
        ))}

        {/* Stainless Steel Bridge Retaining Pins */}
        <mesh material={hardwareMat} position={[-0.15, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.42, 10]} />
        </mesh>
        <mesh material={hardwareMat} position={[0.15, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.42, 10]} />
        </mesh>

        {/* Bleeder Valves & Fluid Port */}
        <mesh material={hardwareMat} position={[0.26, 0.32, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        </mesh>

        {/* Subtle Machined "ITZFIZZ // PRECISION" Caliper Face Badge */}
        <mesh position={[0, 0.08, 0.232]}>
          <planeGeometry args={[0.36, 0.06]} />
          <meshBasicMaterial color="#94A3B8" transparent opacity={0.65} />
        </mesh>
      </group>
    </group>
  );
}
