"use client";

import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090a] transition-opacity duration-700 ease-out ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Subtle glowing logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-[#AFDDFF]/10 blur-xl" />
          <span className="relative text-2xl font-bold tracking-[0.16em] text-white/90 uppercase">
            ITZFIZZ
          </span>
        </div>

        {/* Minimal sleek progress bar */}
        <div className="w-48 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-neutral-500 via-white to-[#AFDDFF] transition-all duration-300 ease-out"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>

        <span className="text-[10px] font-tech tracking-[0.20em] text-neutral-400 uppercase">
          Initializing Scene
        </span>
      </div>
    </div>
  );
}
