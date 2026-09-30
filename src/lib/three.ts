import * as THREE from "three";

export interface DiscoveredWheelPair {
  key: "FL" | "FR" | "BL" | "BR";
  objects: THREE.Object3D[];
  center: THREE.Vector3;
  pivot?: THREE.Group;
}

export interface DiscoveredWheelsResult {
  wheelPivots: THREE.Group[];
  wheelRadius: number;
}

/**
 * Reusable wheel discovery helper system.
 * Programmatically identifies wheels, rims, and tires from arbitrary GLTF naming conventions
 * while strictly excluding calipers, steering wheels, and chassis elements.
 */
export function discoverAndSetupWheels(
  root: THREE.Object3D,
  scale: number = 1.0
): DiscoveredWheelsResult {
  const wheelPivots: THREE.Group[] = [];
  const defaultRadius = 0.323 * scale;

  try {
    const buckets: Record<"FL" | "FR" | "BL" | "BR", THREE.Object3D[]> = {
      FL: [],
      FR: [],
      BL: [],
      BR: [],
    };

    root.traverse((obj) => {
      const name = obj.name || "";
      // Exclude calipers, steering wheel, suspension rods
      if (/caliper|steering|strut|chassis|spring|knuckle/i.test(name)) return;

      const lower = name.toLowerCase();
      const isWheelOrTire =
        lower.includes("wheel") ||
        lower.includes("tire") ||
        lower.includes("rim") ||
        lower.includes("tyre");

      if (!isWheelOrTire || !obj.parent) return;

      if (lower.includes("fl") || (lower.includes("front") && lower.includes("left"))) {
        buckets.FL.push(obj);
      } else if (lower.includes("fr") || (lower.includes("front") && lower.includes("right"))) {
        buckets.FR.push(obj);
      } else if (lower.includes("bl") || (lower.includes("back") && lower.includes("left")) || (lower.includes("rear") && lower.includes("left"))) {
        buckets.BL.push(obj);
      } else if (lower.includes("br") || (lower.includes("back") && lower.includes("right")) || (lower.includes("rear") && lower.includes("right"))) {
        buckets.BR.push(obj);
      }
    });

    const keys: ("FL" | "FR" | "BL" | "BR")[] = ["FL", "FR", "BL", "BR"];

    for (const key of keys) {
      const parts = buckets[key];
      if (!parts || parts.length === 0) continue;

      const parent = parts[0].parent;
      if (!parent) continue;

      const box = new THREE.Box3();
      parts.forEach((p) => box.expandByObject(p));
      if (box.isEmpty()) continue;

      const center = new THREE.Vector3();
      box.getCenter(center);
      parent.worldToLocal(center);

      const pivot = new THREE.Group();
      pivot.name = `DiscoveredWheelPivot_${key}`;
      pivot.position.copy(center);
      parent.add(pivot);

      parts.forEach((p) => {
        p.position.sub(center);
        pivot.add(p);
      });

      wheelPivots.push(pivot);
    }

    return {
      wheelPivots,
      wheelRadius: defaultRadius,
    };
  } catch (err) {
    console.warn("Non-critical: wheel auto-discovery completed with fallback:", err);
    return {
      wheelPivots: [],
      wheelRadius: defaultRadius,
    };
  }
}

/**
 * Calculates subtle automotive suspension physics based on travel and speed.
 */
export function calculateCarPhysics(
  progress: number,
  deltaProgress: number
): { suspensionY: number; pitch: number; roll: number } {
  // Micro road imperfections (subtle sine waves with micro amplitude)
  const suspensionY = Math.sin(progress * 48) * 0.003 + Math.cos(progress * 96) * 0.0015;

  // Pitch: tiny nose dip during movement
  const pitch = -deltaProgress * 0.12;

  // Roll: tiny weight transfer
  const roll = Math.sin(progress * 18) * 0.002;

  return { suspensionY, pitch, roll };
}
