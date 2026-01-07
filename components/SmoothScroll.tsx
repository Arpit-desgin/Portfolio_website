"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Initialize Lenis with mobile-optimized settings
    const lenisConfig = isMobile
      ? {
          duration: 0.8, // Shorter duration for mobile
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical" as const,
          gestureOrientation: "vertical" as const,
          smoothWheel: true,
          wheelMultiplier: 0.5, // Reduce scroll multiplier
          touchMultiplier: 1, // Optimize for touch
          infinite: false,
        }
      : {
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical" as const,
          gestureOrientation: "vertical" as const,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        };

    const lenis = new Lenis(lenisConfig);

    // Optimize RAF loop for mobile
    let animationFrameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  return <>{children}</>;
}

