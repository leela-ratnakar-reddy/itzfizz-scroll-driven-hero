"use client";

import React, { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl p-8 sm:p-12 transition-all duration-500 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold tracking-[0.12em] text-white uppercase">
          ITZFIZZ
        </span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#AFDDFF] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Main Nav Links */}
      <nav className="flex flex-col gap-6 my-auto">
        {links.map((link, idx) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="text-2xl sm:text-3xl font-bold text-white hover:text-[#AFDDFF] tracking-[0.08em] uppercase transition-colors"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <span className="text-xs text-[#AFDDFF]/80 mr-4 font-medium tracking-[0.14em] tabular-nums">
              0{idx + 1}
            </span>
            {link.label}
          </a>
        ))}
      </nav>

      {/* Bottom Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-white/10 text-[10px] font-medium tracking-[0.14em] text-neutral-400 uppercase">
        <span>HIGH PERFORMANCE DIGITAL SYSTEMS</span>
        <span className="text-[#AFDDFF]/90 mt-2 sm:mt-0 tabular-nums">EST. 2026 // PHASE 1-5</span>
      </div>
    </div>
  );
}
