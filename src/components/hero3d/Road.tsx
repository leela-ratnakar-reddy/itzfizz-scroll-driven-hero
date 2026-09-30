"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

interface RoadProps {
  length?: number;
  width?: number;
}

export default function Road({ length = 95, width = 7.2 }: RoadProps) {
  // =========================================================================
  // 1. PROCEDURAL ASPHALT TEXTURE WITH LONGITUDINAL GRAIN & TONAL FALLOFF
  // Generates clean, refined physical asphalt:
  // - Subtle darker patches
  // - Slight roughness variation (0.76–0.88)
  // - Faint longitudinal grain along the driving direction (X axis)
  // - Natural edge tonal falloff (darkening towards shoulders)
  // - Zero distracting digital/procedural noise
  // =========================================================================
  const asphaltTextures = useMemo(() => {
    if (typeof document === "undefined") {
      return { map: null, roughnessMap: null, bumpMap: null };
    }

    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { map: null, roughnessMap: null, bumpMap: null };

    // Fill base dark graphite tone (#171C21)
    ctx.fillStyle = "#171C21";
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    // Roughness canvas
    const rCanvas = document.createElement("canvas");
    rCanvas.width = size;
    rCanvas.height = size;
    const rCtx = rCanvas.getContext("2d");
    const rImgData = rCtx ? rCtx.createImageData(size, size) : null;
    const rData = rImgData ? rImgData.data : null;

    // Bump canvas for subtle micro-texture
    const bCanvas = document.createElement("canvas");
    bCanvas.width = size;
    bCanvas.height = size;
    const bCtx = bCanvas.getContext("2d");
    const bImgData = bCtx ? bCtx.createImageData(size, size) : null;
    const bData = bImgData ? bImgData.data : null;

    for (let y = 0; y < size; y++) {
      // Normalized width across road (0..1)
      const normY = y / size;
      const centerDist = Math.abs(normY - 0.5) * 2; // 0 in center, 1 at edges

      // Subtle edge tonal falloff: road subtly deepens towards shoulders
      const edgeFalloff = -centerDist * centerDist * 3.2;

      // Faint longitudinal texture along X (subtle rolling wear tracks)
      const longitudinalStreak = Math.sin(normY * Math.PI * 4) * 1.4;

      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;

        // Clean fine aggregate grain (not noisy)
        const microGrain = (Math.random() - 0.5) * 8;

        // Subtle darker macro patches spaced along the track
        const patch =
          Math.sin(x * 0.024) * 2.2 +
          Math.cos((x * 0.8 + y * 0.4) * 0.016) * 1.8;

        // Base asphalt tone: #161B20 to #20262C with cool blue-gray undertone
        const r = Math.max(13, Math.min(32, 21 + patch + longitudinalStreak + edgeFalloff + microGrain * 0.3));
        const g = Math.max(16, Math.min(36, 25 + patch + longitudinalStreak + edgeFalloff + microGrain * 0.38));
        const b = Math.max(20, Math.min(43, 30 + patch + longitudinalStreak + edgeFalloff + microGrain * 0.48));

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;

        if (rData) {
          // Roughness variation between 0.76 and 0.86
          const rough = Math.max(194, Math.min(220, 207 + patch * 1.2 + (Math.random() - 0.5) * 12));
          rData[idx] = rough;
          rData[idx + 1] = rough;
          rData[idx + 2] = rough;
          rData[idx + 3] = 255;
        }

        if (bData) {
          // Extremely subtle light-scattering bump
          const bump = Math.max(118, Math.min(138, 128 + microGrain * 0.7));
          bData[idx] = bump;
          bData[idx + 1] = bump;
          bData[idx + 2] = bump;
          bData[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    if (rCtx && rImgData) rCtx.putImageData(rImgData, 0, 0);
    if (bCtx && bImgData) bCtx.putImageData(bImgData, 0, 0);

    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(24, 2.5);

    let roughnessMap: THREE.CanvasTexture | null = null;
    if (rCanvas) {
      roughnessMap = new THREE.CanvasTexture(rCanvas);
      roughnessMap.wrapS = THREE.RepeatWrapping;
      roughnessMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.repeat.set(24, 2.5);
    }

    let bumpMap: THREE.CanvasTexture | null = null;
    if (bCanvas) {
      bumpMap = new THREE.CanvasTexture(bCanvas);
      bumpMap.wrapS = THREE.RepeatWrapping;
      bumpMap.wrapT = THREE.RepeatWrapping;
      bumpMap.repeat.set(24, 2.5);
    }

    return { map, roughnessMap, bumpMap };
  }, []);

  // Clean texture disposal
  useEffect(() => {
    return () => {
      asphaltTextures.map?.dispose();
      asphaltTextures.roughnessMap?.dispose();
      asphaltTextures.bumpMap?.dispose();
    };
  }, [asphaltTextures]);

  // Center broken lane dashes: authentic physical road paint
  const dashes = useMemo(() => {
    const list: { x: number; length: number; opacity: number; emissive: number }[] = [];
    const dashLen = 2.8;
    const dashGap = 4.2;
    const step = dashLen + dashGap;
    const count = Math.floor(length / step);
    const startX = -length / 2 + step / 2;

    for (let i = 0; i < count; i++) {
      const wear = (Math.sin(i * 1.5) + 1) * 0.5;
      list.push({
        x: startX + i * step,
        length: dashLen,
        opacity: 0.78 + wear * 0.18,
        emissive: 0.06 + wear * 0.08,
      });
    }
    return list;
  }, [length]);

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================================= */}
      {/* 1. MAIN ASPHALT SURFACE (Thickness 0.22m, surface at Y = 0.0)             */}
      {/* ========================================================================= */}
      <mesh receiveShadow position={[0, -0.11, 0]}>
        <boxGeometry args={[length, 0.22, width]} />
        <meshStandardMaterial
          color="#1A2026"
          roughness={0.82}
          metalness={0.08}
          map={asphaltTextures.map}
          roughnessMap={asphaltTextures.roughnessMap}
          bumpMap={asphaltTextures.bumpMap}
          bumpScale={0.0018}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. ROAD EDGES & LAYERED TRANSITION                                        */}
      {/* ROAD -> THIN EDGE STRIP -> DARK SHOULDER -> ENVIRONMENT                   */}
      {/* ========================================================================= */}

      {/* --- North Road Boundary (Z = -width / 2) --- */}
      <group position={[0, 0, -width / 2]}>
        {/* Thin Cool-White / Ice-Blue Edge Reflection Strip (#AFDDFF, opacity 0.20) */}
        <mesh position={[0, 0.006, 0.02]}>
          <boxGeometry args={[length, 0.008, 0.03]} />
          <meshBasicMaterial color="#AFDDFF" transparent opacity={0.2} />
        </mesh>

        {/* Low Dark Graphite Curb Stone */}
        <mesh castShadow receiveShadow position={[0, 0.02, -0.12]}>
          <boxGeometry args={[length, 0.16, 0.24]} />
          <meshStandardMaterial
            color="#151A20"
            roughness={0.72}
            metalness={0.15}
          />
        </mesh>

        {/* Dark Shoulder (Z = -0.24 - 1.2 = -1.44) */}
        <mesh receiveShadow position={[0, -0.012, -1.44]}>
          <boxGeometry args={[length * 1.05, 0.18, 2.4]} />
          <meshStandardMaterial
            color="#0C1014"
            roughness={0.92}
            metalness={0.04}
          />
        </mesh>
      </group>

      {/* --- South Road Boundary (Z = +width / 2) --- */}
      <group position={[0, 0, width / 2]}>
        {/* Thin Cool-White / Ice-Blue Edge Reflection Strip (#AFDDFF, opacity 0.20) */}
        <mesh position={[0, 0.006, -0.02]}>
          <boxGeometry args={[length, 0.008, 0.03]} />
          <meshBasicMaterial color="#AFDDFF" transparent opacity={0.2} />
        </mesh>

        {/* Low Dark Graphite Curb Stone */}
        <mesh castShadow receiveShadow position={[0, 0.02, 0.12]}>
          <boxGeometry args={[length, 0.16, 0.24]} />
          <meshStandardMaterial
            color="#151A20"
            roughness={0.72}
            metalness={0.15}
          />
        </mesh>

        {/* Dark Shoulder (Z = +0.24 + 1.2 = +1.44) */}
        <mesh receiveShadow position={[0, -0.012, 1.44]}>
          <boxGeometry args={[length * 1.05, 0.18, 2.4]} />
          <meshStandardMaterial
            color="#0C1014"
            roughness={0.92}
            metalness={0.04}
          />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. CINEMATIC LANE MARKINGS                                                */}
      {/* Slightly rough, faded, subtle emission, physically painted into asphalt   */}
      {/* ========================================================================= */}

      {/* Center Broken Lane Dashes */}
      {dashes.map((d, i) => (
        <mesh key={`dash-${i}`} receiveShadow position={[d.x, 0.002, 0]}>
          <boxGeometry args={[d.length, 0.004, 0.075]} />
          <meshStandardMaterial
            color="#A2ADB9"
            roughness={0.74}
            metalness={0.05}
            emissive="#A2ADB9"
            emissiveIntensity={d.emissive}
            transparent
            opacity={d.opacity}
          />
        </mesh>
      ))}

      {/* North Continuous Outer Guide Line (Z = -width / 2 + 0.45) */}
      <mesh receiveShadow position={[0, 0.002, -width / 2 + 0.45]}>
        <boxGeometry args={[length, 0.004, 0.055]} />
        <meshStandardMaterial
          color="#657382"
          roughness={0.68}
          metalness={0.06}
          emissive="#657382"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* South Continuous Outer Guide Line (Z = +width / 2 - 0.45) */}
      <mesh receiveShadow position={[0, 0.002, width / 2 - 0.45]}>
        <boxGeometry args={[length, 0.004, 0.055]} />
        <meshStandardMaterial
          color="#657382"
          roughness={0.68}
          metalness={0.06}
          emissive="#657382"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 4. DEEP DARK BEDROCK (Near-black: #080A0D)                                */}
      {/* Foundation plane beneath road and shoulders                               */}
      {/* ========================================================================= */}
      <mesh receiveShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[length * 1.25, 0.16, width + 28]} />
        <meshStandardMaterial
          color="#080A0D"
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}
