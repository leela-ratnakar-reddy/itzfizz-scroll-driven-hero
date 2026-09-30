"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  setupWheelPivots,
  getWorldWheelRadius,
} from "./WheelController";

export interface CarModelHandle {
  carGroup?: THREE.Group;
  wheelMeshes?: THREE.Object3D[];
  wheelRadius?: number;
  wheelController?: {
    updateRotation: (distance: number) => void;
  };
  setPhysics?: (suspensionY: number, pitch: number, roll: number) => void;
}

interface CarModelProps {
  rootRef?: React.Ref<THREE.Group>;
  scale?: number;
  carRootRef?:
    | React.Ref<THREE.Group>
    | React.MutableRefObject<THREE.Group | null>
    | React.RefObject<THREE.Group>;
}

export default function CarModel({
  rootRef,
  scale = 118,
  carRootRef,
}: CarModelProps) {
  // Load the actual supplied GLB model from /public/models/
  const { scene } = useGLTF("/models/2010_citroen_ds_survolt.glb");

  const innerRef = useRef<THREE.Group | null>(null);
  const wheelPivotsRef = useRef<THREE.Group[]>([]);
  const prevCarXRef = useRef<number | null>(null);
  const totalAngleRef = useRef<number>(0);

  // 1. Initialize physical wheel pivots on GLB scene load (idempotent)
  useEffect(() => {
    if (!scene) return;
    wheelPivotsRef.current = setupWheelPivots(scene);
  }, [scene]);

  // 2. Upgrade vehicle materials to reveal body curves, metallic sheen, and aerodynamic shapes
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              const name = mat.name.toLowerCase();

              // Body paint & carbon surfaces (originally almost pure black #010101)
              // Lift to rich metallic dark graphite so body curves and reflections are clearly visible
              if (
                name.includes("carpaint") ||
                name.includes("carbon") ||
                name === "material"
              ) {
                if (name.includes("color")) {
                  // Signature Citroën Survolt Electric Cyan livery accents
                  mat.color.setRGB(0.12, 0.85, 1.0);
                  mat.emissive = new THREE.Color("#62D9FF");
                  mat.emissiveIntensity = 0.28;
                  mat.roughness = 0.18;
                  mat.metalness = 0.45;
                  mat.envMapIntensity = 2.4;
                } else {
                  // Dark metallic hypercar body panels
                  mat.color.setRGB(0.08, 0.095, 0.12);
                  mat.roughness = 0.24;
                  mat.metalness = 0.68;
                  mat.envMapIntensity = 3.0;
                }
              } else if (name.includes("rim") || name.includes("wheel")) {
                // Alloy rims and brake assemblies
                mat.color.setRGB(0.16, 0.18, 0.22);
                mat.roughness = 0.2;
                mat.metalness = 0.85;
                mat.envMapIntensity = 2.8;
              } else if (name.includes("glass") || name.includes("window")) {
                // Windshield and canopy glass
                mat.transparent = true;
                mat.opacity = 0.72;
                mat.roughness = 0.05;
                mat.metalness = 0.9;
                mat.envMapIntensity = 3.5;
              } else if (name.includes("light") || name.includes("emiss")) {
                // Headlight / taillight elements
                mat.emissive = new THREE.Color("#62D9FF");
                mat.emissiveIntensity = 0.6;
              } else {
                mat.roughness = Math.min(mat.roughness, 0.35);
                mat.metalness = Math.max(mat.metalness, 0.45);
                mat.envMapIntensity = 2.5;
              }

              mat.needsUpdate = true;
            }
          });
        }
      }
    });
  }, [scene]);

  // 3. Physically Synchronized Wheel Rotation Loop:
  // Executed on every Three.js render frame (smooth 60 FPS).
  // Calculates distance traveled along X and rotates all 4 wheel axle pivots
  // purely around their physical center with zero wobble and zero orbit.
  useFrame(() => {
    const pivots = wheelPivotsRef.current;
    if (!pivots || pivots.length === 0) return;

    // Resolve active car root group (from prop or parent hierarchy)
    const carObj =
      (carRootRef as React.RefObject<THREE.Group>)?.current ||
      innerRef.current?.parent;
    if (!carObj) return;

    const currentX = carObj.position.x;

    // Initialize baseline on first frame
    if (prevCarXRef.current === null) {
      prevCarXRef.current = currentX;
      return;
    }

    const deltaX = currentX - prevCarXRef.current;
    prevCarXRef.current = currentX;

    // Filter sub-millimeter jitter and ignore instant teleports (> 5.0m in a single frame)
    if (Math.abs(deltaX) > 0.00002 && Math.abs(deltaX) < 5.0) {
      const worldWheelRadius = getWorldWheelRadius(scale);

      // Physical rolling without slip: deltaAngle = -deltaX / radius
      // When car moves LEFT -> RIGHT (deltaX > 0), wheels rotate forward (negative rotation.x)
      // When car reverses RIGHT -> LEFT (deltaX < 0), deltaAngle is positive (reverse rotation)
      const deltaAngle = -deltaX / worldWheelRadius;
      totalAngleRef.current += deltaAngle;

      for (let i = 0; i < pivots.length; i++) {
        pivots[i].rotation.x = totalAngleRef.current;
      }
    }
  });

  // Model bounding box in GLB: length ~0.03898m.
  // Scale ROOT group by `scale` (~118) to normalize vehicle length to ~4.6m (~40-45% of screen width).
  // Rotate ROOT group +90 deg around Y so the vehicle faces +X (to the right).
  // ZERO internal child transforms are touched - preserving factory assembly completely.
  return (
    <group
      ref={(node) => {
        innerRef.current = node;
        if (typeof rootRef === "function") {
          rootRef(node);
        } else if (rootRef) {
          (rootRef as React.MutableRefObject<THREE.Group | null>).current = node;
        }
      }}
      rotation={[0, Math.PI / 2, 0]}
      scale={[scale, scale, scale]}
    >
      <primitive object={scene} />
    </group>
  );
}

// Preload the GLB model asset
useGLTF.preload("/models/2010_citroen_ds_survolt.glb");
