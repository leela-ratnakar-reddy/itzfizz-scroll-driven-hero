"use client";

import * as THREE from "three";

/**
 * Geometric specifications for the 4 Citroën DS Survolt wheels in the GLB scene graph.
 *
 * In the model hierarchy:
 * - Parent node: `group1`
 * - Rims: `wheelFL__mesh065...`, `wheelFR__mesh074...`, `wheelBL__mesh047...`, `wheelBR__mesh056...`
 * - Tires: `wheelFL_tire__mesh071...`, `wheelFR_tire__mesh080...`, `wheelBL_tire__mesh053...`, `wheelBR_tire__mesh062...`
 * - Calipers: `wheelFL_caliper...`, `wheelFR_caliper...`, `wheelBL_caliper...`, `wheelBR_caliper...`
 *   (Calipers stay stationary in group1, exactly matching real automotive brake mounting).
 *
 * All coordinates are defined in group1 local space to 6 decimal places.
 * Local tire radius in group1 = 0.323002m.
 */
export interface WheelSpec {
  key: "FL" | "FR" | "BL" | "BR";
  name: string;
  rimMatch: string;
  tireMatch: string;
  center: THREE.Vector3;
}

export const WHEEL_SPECS: WheelSpec[] = [
  {
    key: "FL",
    name: "Front-Left Wheel",
    rimMatch: "wheelfl__mesh065",
    tireMatch: "wheelfl_tire__mesh071",
    center: new THREE.Vector3(-0.801303, 0.322971, -1.170206),
  },
  {
    key: "FR",
    name: "Front-Right Wheel",
    rimMatch: "wheelfr__mesh074",
    tireMatch: "wheelfr_tire__mesh080",
    center: new THREE.Vector3(0.801303, 0.322971, -1.170206),
  },
  {
    key: "BL",
    name: "Rear-Left Wheel",
    rimMatch: "wheelbl__mesh047",
    tireMatch: "wheelbl_tire__mesh053",
    center: new THREE.Vector3(-0.801303, 0.322971, 1.170215),
  },
  {
    key: "BR",
    name: "Rear-Right Wheel",
    rimMatch: "wheelbr__mesh056",
    tireMatch: "wheelbr_tire__mesh062",
    center: new THREE.Vector3(0.801304, 0.322971, 1.170214),
  },
];

/** Local radius of the tire in group1 coordinates */
export const WHEEL_LOCAL_RADIUS = 0.323002;

/** Internal FBX scale factor baked into the GLB */
export const WHEEL_INTERNAL_SCALE = 0.01;

/**
 * Calculates physical tire radius in world space based on the applied model scale factor.
 * E.g., for default desktop carScale = 118:
 * Radius = 0.323002 * 0.01 * 118 = 0.38114m (~38.1cm, standard 19/20-inch wheel).
 */
export function getWorldWheelRadius(scale: number): number {
  return WHEEL_LOCAL_RADIUS * WHEEL_INTERNAL_SCALE * scale;
}

/**
 * Idempotently creates axle pivot groups for the 4 wheels and reparents
 * their respective rim and tire meshes to rotate cleanly around their physical axles.
 *
 * Preserves:
 * - Factory mesh geometry, materials, and shadows
 * - Zero axle wobble / zero orbit around the car
 * - Stationary brake calipers
 */
export function setupWheelPivots(scene: THREE.Object3D): THREE.Group[] {
  const pivots: THREE.Group[] = [];

  for (const spec of WHEEL_SPECS) {
    let rim: THREE.Object3D | null = null;
    let tire: THREE.Object3D | null = null;

    scene.traverse((child) => {
      const lowerName = child.name ? child.name.toLowerCase() : "";
      if (lowerName.includes(spec.rimMatch) && lowerName.endsWith("rims")) {
        rim = child;
      }
      if (lowerName.includes(spec.tireMatch) && lowerName.endsWith("details")) {
        tire = child;
      }
    });

    if (!rim || !tire) {
      continue;
    }

    const pivotName = `wheel_pivot_${spec.key}`;

    // If already reparented under this pivot group, reuse existing pivot (idempotent)
    const rimObj = rim as THREE.Object3D;
    const tireObj = tire as THREE.Object3D;
    if (rimObj.parent && rimObj.parent.name === pivotName) {
      pivots.push(rimObj.parent as THREE.Group);
      continue;
    }

    const parent = rimObj.parent;
    if (!parent) continue;

    // Create axle pivot group placed exactly at the wheel physical center
    const pivot = new THREE.Group();
    pivot.name = pivotName;
    pivot.position.copy(spec.center);
    parent.add(pivot);

    // Offset child mesh positions to compensate for pivot offset
    rimObj.position.sub(spec.center);
    tireObj.position.sub(spec.center);

    // Reparent rim and tire into the rotating pivot group
    pivot.add(rimObj);
    pivot.add(tireObj);

    pivots.push(pivot);
  }

  return pivots;
}
