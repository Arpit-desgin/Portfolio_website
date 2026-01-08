"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { isMobileDevice } from "@/lib/performanceUtils";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only hydrate on client
    setIsHydrated(true);
    
    // Check if mobile ONCE on mount
    const isMobileNow = isMobileDevice();
    setIsMobile(isMobileNow);

    // CRITICAL: DISABLE LENIS COMPLETELY ON MOBILE FOR NATIVE SCROLLING
    if (isMobileNow) {
      // Use native smooth scrolling on mobile - much faster
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }

    // Desktop only: Initialize Lenis with performance-optimized settings
    const lenis = new Lenis({
      duration: 1.2, // Smooth but not too long
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical" as const,
      gestureOrientation: "vertical" as const,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Single optimized RAF loop
    let animationFrameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return <>{isHydrated ? children : children}</>;
}

