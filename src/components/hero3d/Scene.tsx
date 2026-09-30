"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Text } from "@react-three/drei";
import * as THREE from "three";
import Road from "./Road";
import CarModel from "./CarModel";
import BackgroundEnvironment from "./BackgroundEnvironment";

interface SceneProps {
  carRootRef?: React.Ref<THREE.Group>;
  carScale?: number;
  isMobile?: boolean;
  progressRef?: React.MutableRefObject<number>;
}

// Camera Controller managing perspective framing & subtle parallax tracking
function CameraRig({
  isMobile,
  progressRef,
}: {
  isMobile: boolean;
  progressRef?: React.MutableRefObject<number>;
}) {
  const { camera, size } = useThree();
  const targetVec = useRef(new THREE.Vector3());

  // Base camera orientation
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      if (size.width < 768 || isMobile) {
        camera.position.set(0, 11.5, 18.0);
        camera.fov = 26;
      } else {
        camera.position.set(0, 8.5, 14.5);
        camera.fov = 22;
      }
      camera.lookAt(0, 0.35, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, isMobile]);

  // Frame-by-frame subtle cinematic camera tracking parallax
  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const p = progressRef ? progressRef.current : 0.5;

    if (size.width < 768 || isMobile) {
      const camX = THREE.MathUtils.lerp(-1.2, 1.2, p);
      const lookX = THREE.MathUtils.lerp(-0.5, 0.5, p);
      camera.position.x = camX;
      targetVec.current.set(lookX, 0.35, 0);
      camera.lookAt(targetVec.current);
    } else {
      const camX = THREE.MathUtils.lerp(-1.6, 1.6, p);
      const lookX = THREE.MathUtils.lerp(-0.7, 0.7, p);
      camera.position.x = camX;
      targetVec.current.set(lookX, 0.35, 0);
      camera.lookAt(targetVec.current);
    }
  });

  return null;
}

// Road Text Reveal Component:
// Physically painted ON the asphalt road plane (rotation=[-PI/2, 0, 0]),
// sized ~14.7% smaller (0.58 desktop / 0.32 mobile per Requirement 9),
// positioned toward left/middle at X = -0.75, Z = -1.25 with 0.10em letter spacing and #F2F0EA color,
// with subtle contact stencil shading for authentic physical asphalt bonding,
// staged entrance starting at 300ms, and progressively revealed by the car as it drives across.
function RoadTextReveal({
  carRootRef,
  isMobile,
}: {
  carRootRef?: React.Ref<THREE.Group>;
  isMobile: boolean;
}) {
  const textRef = useRef<any>(null);
  const shadowTextRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);

  useFrame((state) => {
    // 1. Initial entrance choreography (Requirement 1 & 2):
    // 300ms: reveal begins, settles over 800-1000ms using cubic-bezier curve (power3.out)
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }
    const elapsedMs = (state.clock.getElapsedTime() - startTimeRef.current) * 1000;

    let entranceOpacity = 1;
    let entranceYOffset = 0;

    if (elapsedMs < 300) {
      entranceOpacity = 0;
      entranceYOffset = -0.015;
    } else if (elapsedMs < 1200) {
      const t = (elapsedMs - 300) / 900;
      // power3.out ease: 1 - (1 - t)^3 (matches cubic-bezier(0.16, 1, 0.3, 1))
      const eased = 1 - Math.pow(1 - t, 3);
      entranceOpacity = eased;
      entranceYOffset = -0.015 * (1 - eased);
    }

    if (groupRef.current) {
      groupRef.current.position.y = 0.022 + entranceYOffset;
    }

    if (textRef.current) {
      textRef.current.fillOpacity = entranceOpacity;
    }
    if (shadowTextRef.current) {
      shadowTextRef.current.fillOpacity = entranceOpacity * 0.65;
    }

    // 2. Car-driven progressive reveal tracking vehicle X position:
    const carObj = (carRootRef as React.RefObject<THREE.Group>)?.current;
    if (!carObj) return;

    const carX = carObj.position.x;
    // Reveal boundary cleanly tracks behind car as it advances
    const revealX = carX - 0.25;

    // Apply clipRect to Troika Text meshes
    if (textRef.current) {
      textRef.current.clipRect = [-100, -100, revealX, 100];
      const mat = Array.isArray(textRef.current.material)
        ? textRef.current.material[0]
        : textRef.current.material;
      if (mat?.uniforms?.uTroikaClipRect) {
        mat.uniforms.uTroikaClipRect.value.set(-100, -100, revealX, 100);
      }
    }

    if (shadowTextRef.current) {
      shadowTextRef.current.clipRect = [-100, -100, revealX, 100];
      const mat = Array.isArray(shadowTextRef.current.material)
        ? shadowTextRef.current.material[0]
        : shadowTextRef.current.material;
      if (mat?.uniforms?.uTroikaClipRect) {
        mat.uniforms.uTroikaClipRect.value.set(-100, -100, revealX, 100);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[-0.75, 0.022, -1.25]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1.0, isMobile ? 1.0 : 1.15, 1.0]}
    >
      {/* Subtle Contact Stencil Shading (Requirement 9 & 12: physically embedded in asphalt) */}
      <Text
        ref={shadowTextRef}
        font="/fonts/orbitron.ttf"
        fontSize={isMobile ? 0.32 : 0.56}
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
        color="#040609"
        letterSpacing={0.12}
        position={[0, -0.005, -0.001]}
        clipRect={[-100, -100, -20, 100]}
        fillOpacity={0.65}
        depthOffset={0}
      >
        WELCOME ITZFIZZ
      </Text>

      {/* Main Physically Painted Road Headline (Orbitron 700 bold) */}
      <Text
        ref={textRef}
        font="/fonts/orbitron.ttf"
        fontSize={isMobile ? 0.32 : 0.56}
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
        color="#F2F0EA"
        letterSpacing={0.12}
        position={[0, 0, 0]}
        clipRect={[-100, -100, -20, 100]}
        material-roughness={0.84}
        material-metalness={0.04}
        depthOffset={-1}
      >
        WELCOME ITZFIZZ
      </Text>
    </group>
  );
}

export default function Scene({
  carRootRef,
  carScale = 118,
  isMobile = false,
  progressRef,
}: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 8.5, 14.5],
        fov: 22,
        near: 0.1,
        far: 120,
      }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMappingExposure: 1.25,
      }}
      className="w-full h-full"
    >
      <CameraRig isMobile={isMobile} progressRef={progressRef} />

      {/* Atmospheric Fog: 0% on car at 14m, subtle haze on midground (20m), soft haze on background (23m), dissolving horizon (25m) */}
      <fog attach="fog" args={["#080A0D", 17, 34]} />

      {/* Cinematic Automotive Lighting Pipeline */}
      {/* 1. Ambient & Hemisphere for balanced dark studio fill */}
      <ambientLight intensity={1.25} color="#0D1117" />
      <hemisphereLight
        color="#E2E8F0"
        groundColor="#0B0E13"
        intensity={1.05}
      />

      {/* 2. Key Sun Directional Light (Above / Front-Left, casting soft contact shadows) */}
      <directionalLight
        position={[8, 14, 12]}
        intensity={3.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={32}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0002}
      />

      {/* 3. Cool Electric Cyan Fill Light (Opposite side: #AFDDFF) */}
      <directionalLight
        position={[-12, 7, 8]}
        color="#AFDDFF"
        intensity={1.5}
      />

      {/* 4. Cool-White / Ice-Blue Rim Light (Behind / Right: catching rear spoiler and roof spine) */}
      <directionalLight
        position={[12, 6, -10]}
        color="#E8F4FA"
        intensity={1.3}
      />

      {/* 5. Subtle Secondary Rim Light (Behind / Left: subtle cyan edge) */}
      <directionalLight
        position={[-8, 6, -12]}
        color="#62D9FF"
        intensity={0.75}
      />

      {/* 6. Studio Softbox Environment Reflections */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer
            form="rect"
            intensity={3.2}
            position={[0, 12, 0]}
            scale={[45, 6, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={1.9}
            position={[-10, 5, 8]}
            scale={[24, 4, 1]}
            color="#AFDDFF"
          />
          <Lightformer
            form="rect"
            intensity={1.5}
            position={[10, 5, -8]}
            scale={[24, 4, 1]}
            color="#E8F4FA"
          />
        </group>
      </Environment>

      {/* 3D Scene Elements */}
      <Suspense fallback={null}>
        {/* Cinematic Distant Proving Ground Environment (Behind road, fills upper space with depth & parallax) */}
        <BackgroundEnvironment progressRef={progressRef} isMobile={isMobile} />

        {/* Real 3D Asphalt Road with Curbs, Shoulders, and Refined Markings */}
        <Road length={95} width={7.2} />

        {/* Real 3D Painted Road Typography (Physically on asphalt, revealed by the car) */}
        <RoadTextReveal carRootRef={carRootRef} isMobile={isMobile} />

        {/* Whole Car Group (Positioned in front lane Z = 0.6, translated horizontally via carRootRef) */}
        <group ref={carRootRef} position={[0, 0, 0.6]}>
          <CarModel scale={carScale} carRootRef={carRootRef} />

          {/* Ground Contact Shadow (Soft, convincing occlusion under wheels and chassis) */}
          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.80}
            scale={[6.4, 3.4]}
            blur={2.2}
            far={2.4}
            color="#040608"
          />

          {/* Subtle Diffuse Ground Reflection connecting chassis to asphalt without mirror glare */}
          <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.2, 2.6]} />
            <meshBasicMaterial
              color="#16222C"
              transparent
              opacity={0.10}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Suspense>
    </Canvas>
  );
}
