"use client";

import React, { useRef, useEffect } from "react";
import { isReducedMotion } from "@/lib/animation";

interface ServicesVideoCanvasProps {
  src: string;
  className?: string;
}

export default function ServicesVideoCanvas({
  src,
  className = "",
}: ServicesVideoCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!container || !canvas || !video) return;

    // 1. Configure the hidden video element for silent background decoding
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");

    const startPlayback = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Gracefully defer if browser policy requires user gesture
        });
      }
    };

    startPlayback();

    // Prevent Safari from staying in paused state
    const handlePause = () => {
      if (!video.ended) {
        video.play().catch(() => {});
      }
    };
    video.addEventListener("pause", handlePause);

    // 2. High-DPI / Retina Canvas Sizing with object-fit: cover
    const updateCanvasDimensions = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const width = rect.width || container.clientWidth;
      const height = rect.height || container.clientHeight;
      if (!width || !height) return;

      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

      const targetW = Math.floor(width * dpr);
      const targetH = Math.floor(height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    updateCanvasDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasDimensions();
    });
    resizeObserver.observe(container);

    // 3. requestAnimationFrame render loop drawing decoded video frames to canvas
    let animId: number | null = null;
    let isIntersecting = true;

    const drawCoverFrame = (ctx: CanvasRenderingContext2D) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      if (cw === 0 || ch === 0 || vw === 0 || vh === 0) return;

      const videoRatio = vw / vh;
      const canvasRatio = cw / ch;

      let sWidth = vw;
      let sHeight = vh;
      let sx = 0;
      let sy = 0;

      if (videoRatio > canvasRatio) {
        // Video is wider than canvas: crop sides horizontally
        sWidth = vh * canvasRatio;
        sx = (vw - sWidth) / 2;
      } else {
        // Video is taller than canvas: crop top/bottom vertically
        sHeight = vw / canvasRatio;
        sy = (vh - sHeight) / 2;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
    };

    const renderLoop = () => {
      if (!isIntersecting) {
        animId = null;
        return;
      }

      if (canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext("2d", { alpha: true });
        if (ctx) {
          drawCoverFrame(ctx);
        }
      }

      if (isReducedMotion()) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    const startLoop = () => {
      if (animId === null) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    const stopLoop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    startLoop();

    // Render single frame on video load events immediately
    const handleFrameReady = () => {
      if (canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext("2d", { alpha: true });
        if (ctx) {
          drawCoverFrame(ctx);
        }
      }
    };
    video.addEventListener("loadedmetadata", handleFrameReady);
    video.addEventListener("loadeddata", handleFrameReady);
    video.addEventListener("canplay", handleFrameReady);

    // 4. Viewport IntersectionObserver to pause loop/video when far offscreen
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isIntersecting = true;
              startPlayback();
              startLoop();
            } else {
              isIntersecting = false;
              if (!video.paused) {
                video.pause();
              }
              stopLoop();
            }
          });
        },
        { rootMargin: "400px" }
      );
      intersectionObserver.observe(container);
    }

    // 5. Global gesture listener to resume playback if browser deferred autoplay
    const handleGesture = () => {
      startPlayback();
      startLoop();
    };

    window.addEventListener("pointerdown", handleGesture, { passive: true });
    window.addEventListener("touchstart", handleGesture, { passive: true });
    window.addEventListener("scroll", handleGesture, { passive: true });
    window.addEventListener("wheel", handleGesture, { passive: true });

    return () => {
      stopLoop();
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleFrameReady);
      video.removeEventListener("loadeddata", handleFrameReady);
      video.removeEventListener("canplay", handleFrameReady);
      resizeObserver.disconnect();
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("scroll", handleGesture);
      window.removeEventListener("wheel", handleGesture);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden pointer-events-none select-none"
      style={{ pointerEvents: "none" }}
    >
      {/* 
        THE CANVAS IS THE ONLY VISIBLE MEDIA ELEMENT.
        Because this is a standard HTML5 Canvas 2D context, Safari/WebKit 
        can NEVER render native video play buttons (▶), pause buttons (⏸), 
        hover overlays, or controls over it.
      */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`cinematic-flying-canvas ${className}`}
        style={{ pointerEvents: "none" }}
      />

      {/* 
        OFFSCREEN HIDDEN VIDEO: Frame source only.
        Positioned far outside the viewport in coordinate space (-9999px)
        with opacity 0 and pointerEvents none.
        Never visually displayed, so no browser media UI can ever appear on screen.
      */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        tabIndex={-1}
        onError={(e) => {
          const v = e.currentTarget;
          if (v.src && !v.src.includes("/videos/lumen-service.mp4")) {
            v.src = "/videos/lumen-service.mp4";
            v.load();
            v.play().catch(() => {});
          }
        }}
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -999,
        }}
      />
    </div>
  );
}
