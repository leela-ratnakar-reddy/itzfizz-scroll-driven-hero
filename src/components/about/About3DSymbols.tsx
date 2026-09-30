"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { isReducedMotion } from "@/lib/animation";

interface About3DSymbolsProps {
  mousePos: { x: number; y: number };
  scrollProgressRef: React.MutableRefObject<number>;
}

// =============================================================================
// SYMBOL 01: 3D CRESCENT / MOON (TOP-LEFT) — HIERARCHY: 100% (70–100px visual)
// =============================================================================
function CrescentSymbol({
  mousePos,
  scrollProgressRef,
  isMobile,
}: {
  mousePos: { x: number; y: number };
  scrollProgressRef: React.MutableRefObject<number>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const crescentGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const outerR = 0.82;
    const innerR = 0.68;
    const offset = 0.32;

    shape.absarc(0, 0, outerR, Math.PI * 0.16, Math.PI * 1.84, false);
    shape.absarc(offset, 0, innerR, Math.PI * 1.66, Math.PI * 0.34, true);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 5,
    });
  }, []);

  const { bodyMat, edgeMat } = useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0B5F86"),
      roughness: 0.26,
      metalness: 0.38,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.8,
    });

    const edge = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#AFDDFF"),
      roughness: 0.2,
      metalness: 0.85,
      emissive: new THREE.Color("#62D9FF"),
      emissiveIntensity: 0.1, // Reduced glow by 45%
      transparent: true,
      opacity: 0.8,
    });

    return { bodyMat: body, edgeMat: edge };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (isReducedMotion()) return;

    const time = state.clock.getElapsedTime();
    const scrollP = scrollProgressRef.current;

    // Slow, suspended 7s float cycle (minimal travel: Y ±4-8px, X ±2-5px)
    const floatY = Math.sin(time * 0.9) * 0.035;
    const floatX = Math.cos(time * 0.75) * 0.02;
    const floatRotZ = Math.sin(time * 0.6) * 0.025;

    // Reduced scroll parallax (max 12-15px travel)
    const scrollY = (scrollP - 0.5) * -0.18;

    // Very subtle mouse tilt (±1°)
    const targetRotX = 0.15 + mousePos.y * 0.03;
    const targetRotY = -0.2 + mousePos.x * 0.04;

    // Positioned close to top-left edge (outside central safe zone)
    const targetPosX = -viewport.width * (isMobile ? 0.44 : 0.435) + floatX;
    const targetPosY = viewport.height * (isMobile ? 0.44 : 0.42) + floatY + scrollY;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.06);
    groupRef.current.position.z = -0.45; // Subtle depth behind text

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.22 + floatRotZ, 0.06);
  });

  // Reduced scale (0.50 of previous size on desktop, ~85px diameter)
  const baseScale = isMobile ? 0.32 : 0.52;

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* 3D Extruded Crescent Body */}
      <mesh geometry={crescentGeo} material={bodyMat} castShadow receiveShadow />

      {/* Subtle Inner Accent Rim */}
      <mesh material={edgeMat} position={[0.3, 0, 0.12]}>
        <torusGeometry args={[0.66, 0.02, 12, 36, Math.PI * 0.9]} />
      </mesh>

      {/* Atmospheric Soft Shadow Disc */}
      <mesh position={[0, -0.05, -0.25]}>
        <circleGeometry args={[0.95, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// =============================================================================
// SYMBOL 02: 3D GEOMETRIC CUBE / BLOCK (TOP-RIGHT) — HIERARCHY: 90% (75–105px visual)
// =============================================================================
function CubeSymbol({
  mousePos,
  scrollProgressRef,
  isMobile,
}: {
  mousePos: { x: number; y: number };
  scrollProgressRef: React.MutableRefObject<number>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const { cubeMat, insetMat, hardwareMat } = useMemo(() => {
    const cube = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0A324D"),
      roughness: 0.24,
      metalness: 0.45,
      clearcoat: 0.9,
      clearcoatRoughness: 0.14,
      transparent: true,
      opacity: 0.75,
    });

    const inset = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#071927"),
      roughness: 0.38,
      metalness: 0.72,
      transparent: true,
      opacity: 0.75,
    });

    const hardware = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#AFDDFF"),
      roughness: 0.18,
      metalness: 0.88,
      emissive: new THREE.Color("#62D9FF"),
      emissiveIntensity: 0.12, // Reduced glow by 50%
      transparent: true,
      opacity: 0.75,
    });

    return { cubeMat: cube, insetMat: inset, hardwareMat: hardware };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (isReducedMotion()) return;

    const time = state.clock.getElapsedTime();
    const scrollP = scrollProgressRef.current;

    // Slow, suspended 8s float cycle
    const floatY = Math.sin(time * 0.8) * 0.038;
    const floatX = Math.cos(time * 0.65) * 0.02;

    // Scroll parallax
    const scrollY = (scrollP - 0.5) * -0.22;

    // Slow cinematic multi-axis rotation
    const rotX = 0.32 + Math.sin(time * 0.35) * 0.06 + mousePos.y * 0.03;
    const rotY = 0.42 + Math.cos(time * 0.3) * 0.07 + mousePos.x * 0.04;
    const rotZ = Math.sin(time * 0.4) * 0.04;

    // Positioned close to top-right edge (outside central safe zone)
    const targetPosX = viewport.width * (isMobile ? 0.44 : 0.435) + floatX;
    const targetPosY = viewport.height * (isMobile ? 0.44 : 0.42) + floatY + scrollY;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.06);
    groupRef.current.position.z = -0.45; // Subtle depth behind text

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rotZ, 0.06);
  });

  // Reduced scale (90% of crescent: 0.46 on desktop, ~80px dimension)
  const baseScale = isMobile ? 0.29 : 0.46;

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main Beveled 3D Cube */}
      <RoundedBox args={[1.22, 1.22, 1.22]} radius={0.14} smoothness={5} material={cubeMat} castShadow receiveShadow>
        {/* Front Inset Chamfer Face */}
        <mesh material={insetMat} position={[0, 0, 0.612]}>
          <planeGeometry args={[0.82, 0.82]} />
        </mesh>

        {/* Central Node Marker */}
        <mesh material={hardwareMat} position={[0, 0, 0.62]}>
          <boxGeometry args={[0.22, 0.22, 0.02]} />
        </mesh>
      </RoundedBox>

      {/* Atmospheric Soft Shadow Disc */}
      <mesh position={[0, -0.75, -0.2]}>
        <circleGeometry args={[0.9, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// =============================================================================
// SYMBOL 03: 3D ABSTRACT SMILEY / FACE (BOTTOM-LEFT) — HIERARCHY: 95% (75–105px visual)
// =============================================================================
function SmileySymbol({
  mousePos,
  scrollProgressRef,
  isMobile,
}: {
  mousePos: { x: number; y: number };
  scrollProgressRef: React.MutableRefObject<number>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const { faceMat, featureMat } = useMemo(() => {
    const face = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#082132"),
      roughness: 0.26,
      metalness: 0.42,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.75,
    });

    const feature = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#AFDDFF"),
      roughness: 0.2,
      metalness: 0.85,
      emissive: new THREE.Color("#62D9FF"),
      emissiveIntensity: 0.15, // Reduced glow by 55%
      transparent: true,
      opacity: 0.75,
    });

    return { faceMat: face, featureMat: feature };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (isReducedMotion()) return;

    const time = state.clock.getElapsedTime();
    const scrollP = scrollProgressRef.current;

    // Slow, suspended 6s float cycle
    const floatY = Math.sin(time * 1.05) * 0.036;
    const floatX = Math.cos(time * 0.85) * 0.02;
    const floatRotZ = Math.sin(time * 0.7) * 0.03;

    // Scroll parallax
    const scrollY = (scrollP - 0.5) * 0.15;

    // Subtle mouse tilt
    const targetRotX = 0.18 + mousePos.y * 0.03;
    const targetRotY = 0.22 + mousePos.x * 0.04;

    // Positioned near bottom-left edge (outside central safe zone)
    const targetPosX = -viewport.width * (isMobile ? 0.44 : 0.435) + floatX;
    const targetPosY = -viewport.height * (isMobile ? 0.44 : 0.40) + floatY + scrollY;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.06);
    groupRef.current.position.z = -0.45; // Subtle depth behind text

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -0.12 + floatRotZ, 0.06);
  });

  // Reduced scale (95% of crescent: 0.49 on desktop, ~85px diameter)
  const baseScale = isMobile ? 0.3 : 0.49;

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main Face Base Disc */}
      <mesh material={faceMat} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.22, 48]} />
      </mesh>

      {/* Beveled Edge Torus Chamfer */}
      <mesh material={faceMat} position={[0, 0, 0.1]} castShadow>
        <torusGeometry args={[0.85, 0.07, 16, 48]} />
      </mesh>

      {/* Abstract Eyes: Dual Precision Vertical Capsule Bars */}
      <mesh material={featureMat} position={[-0.26, 0.18, 0.125]}>
        <cylinderGeometry args={[0.065, 0.065, 0.26, 16]} />
      </mesh>
      <mesh material={featureMat} position={[0.26, 0.18, 0.125]}>
        <cylinderGeometry args={[0.065, 0.065, 0.26, 16]} />
      </mesh>

      {/* Abstract Smile: Sleek Torus Arc */}
      <mesh
        material={featureMat}
        position={[0, -0.16, 0.125]}
        rotation={[0, 0, -Math.PI * 0.88]}
      >
        <torusGeometry args={[0.36, 0.05, 16, 32, Math.PI * 0.76]} />
      </mesh>

      {/* Atmospheric Soft Shadow Disc */}
      <mesh position={[0, -0.05, -0.22]}>
        <circleGeometry args={[0.95, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// =============================================================================
// SYMBOL 04: 3D CURSOR / ARROW (BOTTOM-RIGHT) — HIERARCHY: 90% (80–110px visual)
// =============================================================================
function CursorSymbol({
  mousePos,
  scrollProgressRef,
  isMobile,
}: {
  mousePos: { x: number; y: number };
  scrollProgressRef: React.MutableRefObject<number>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const cursorGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.95);
    shape.lineTo(0.68, -0.42);
    shape.lineTo(0.24, -0.32);
    shape.lineTo(0.38, -0.88);
    shape.lineTo(0.12, -0.96);
    shape.lineTo(-0.02, -0.42);
    shape.lineTo(-0.42, -0.42);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 5,
    });
  }, []);

  const { cursorMat, coreMat } = useMemo(() => {
    const cursor = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0891B2"),
      roughness: 0.2,
      metalness: 0.52,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      emissive: new THREE.Color("#0B5F86"),
      emissiveIntensity: 0.1, // Reduced glow by 45%
      transparent: true,
      opacity: 0.75,
    });

    const core = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#AFDDFF"),
      roughness: 0.2,
      metalness: 0.88,
      emissive: new THREE.Color("#62D9FF"),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.75,
    });

    return { cursorMat: cursor, coreMat: core };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (isReducedMotion()) return;

    const time = state.clock.getElapsedTime();
    const scrollP = scrollProgressRef.current;

    // Slow, suspended 9s float cycle
    const floatY = Math.sin(time * 0.7) * 0.035;
    const floatX = Math.cos(time * 0.6) * 0.02;

    // Scroll parallax
    const scrollY = (scrollP - 0.5) * -0.18;

    // Subtle mouse tilt
    const targetRotX = 0.18 + mousePos.y * 0.03;
    const targetRotY = -0.26 + mousePos.x * 0.04;

    // Positioned near bottom-right edge (outside central safe zone)
    const targetPosX = viewport.width * (isMobile ? 0.44 : 0.435) + floatX;
    const targetPosY = -viewport.height * (isMobile ? 0.44 : 0.40) + floatY + scrollY;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.06);
    groupRef.current.position.z = -0.45; // Subtle depth behind text

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -0.32, 0.06);
  });

  // Reduced scale (90% of crescent: 0.46 on desktop, ~85px dimension)
  const baseScale = isMobile ? 0.29 : 0.46;

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main 3D Beveled Arrow Cursor Body */}
      <mesh geometry={cursorGeo} material={cursorMat} castShadow receiveShadow />

      {/* Central Specular Inset Strip */}
      <mesh material={coreMat} position={[0, -0.1, 0.12]}>
        <boxGeometry args={[0.08, 0.6, 0.02]} />
      </mesh>

      {/* Atmospheric Soft Shadow Disc */}
      <mesh position={[0, -0.3, -0.22]}>
        <circleGeometry args={[0.85, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// =============================================================================
// MAIN SHARED R3F CANVAS CONTAINER
// =============================================================================
export default function About3DSymbols({ mousePos, scrollProgressRef }: About3DSymbolsProps) {
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0, 7.5],
        fov: 38,
        near: 0.1,
        far: 30,
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
      {/* STUDIO LIGHTING PIPELINE                                                */}
      {/* Soft key light + controlled #AFDDFF rim light + dark ambient fill       */}
      {/* ======================================================================= */}
      <ambientLight intensity={0.65} />

      {/* Key Studio Light (Front / Top) */}
      <directionalLight position={[4, 6, 5]} intensity={1.8} castShadow />

      {/* Controlled Cool Ice-Blue Rim Light (Back / Top-Right: #AFDDFF) */}
      <directionalLight position={[5, 6, -5]} color="#AFDDFF" intensity={1.75} />

      {/* Opposing Subtle Fill Light (Left / Bottom: #62D9FF) */}
      <directionalLight position={[-5, -4, 4]} color="#62D9FF" intensity={0.6} />

      {/* ======================================================================= */}
      {/* FOUR SYMBOLS SUBTLY FRAMING THE PERIMETER OF COMPOSITION                */}
      {/* ======================================================================= */}
      <CrescentSymbol mousePos={mousePos} scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <CubeSymbol mousePos={mousePos} scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <SmileySymbol mousePos={mousePos} scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <CursorSymbol mousePos={mousePos} scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
    </Canvas>
  );
}
