import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initGSAP() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createScrollTrigger(vars: ScrollTrigger.Vars): ScrollTrigger {
  initGSAP();
  return ScrollTrigger.create(vars);
}
