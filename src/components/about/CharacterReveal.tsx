"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/lib/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CharacterRevealProps {
  text: string;
  className?: string;
}

export default function CharacterReveal({
  text,
  className = "",
}: CharacterRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isReducedMotion()) {
      const chars = el.querySelectorAll(".char-span");
      chars.forEach((c) => ((c as HTMLElement).style.opacity = "1"));
      return;
    }

    const chars = el.querySelectorAll(".char-span");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 0.8,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [text]);

  const words = text.split(" ");

  return (
    <h2 ref={containerRef} className={className}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.3em]">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className="char-span inline-block transition-opacity duration-200"
              style={{ opacity: 0.2 }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
