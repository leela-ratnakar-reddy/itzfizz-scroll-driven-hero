"use client";

import React, { useState } from "react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "WORK", href: "#work" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "BENEFITS", href: "#benefits" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-12 py-5 transition-colors duration-300"
        style={{
          background: "rgba(5, 8, 11, 0.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* Brand Wordmark (Requirement 7: Orbitron bold 0.08-0.14em uppercase) */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <span className="text-lg sm:text-xl font-bold tracking-[0.12em] text-white uppercase group-hover:text-[#AFDDFF] transition-colors">
            ITZFIZZ
          </span>
          <span className="hidden md:inline-block w-1.5 h-1.5 bg-[#AFDDFF] animate-pulse" />
        </a>

        {/* Desktop Links (Requirement 6: Orbitron 11-13px, 500-600, 0.12em) */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11.5px] font-medium tracking-[0.12em] text-neutral-300 hover:text-white uppercase transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#AFDDFF] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}

          {/* Minimal Action Badge */}
          <a
            href="#contact"
            className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#AFDDFF] bg-[#AFDDFF]/10 border border-[#AFDDFF]/30 hover:border-[#AFDDFF] hover:bg-[#AFDDFF]/20 px-3.5 py-1.5 rounded transition-all duration-300"
          >
            LET&apos;S TALK
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation"
            className="flex flex-col gap-1.5 p-2 text-white hover:text-cyan-400 transition-colors"
          >
            <span className="w-6 h-[1.5px] bg-white rounded-full transition-transform" />
            <span className="w-4 h-[1.5px] bg-white rounded-full self-end transition-transform" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
}
