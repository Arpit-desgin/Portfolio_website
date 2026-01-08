"use client";

import { useEffect, useRef } from "react";

/**
 * IsolatedSplineContainer
 * Isolates Spline canvas from scroll repaints and layout recalculations
 * Prevents Spline from interfering with smooth scrolling
 */
export default function IsolatedSplineContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // CRITICAL: Isolate container from scroll repaints
    // This prevents scroll events from affecting Spline rendering
    const container = containerRef.current;

    // Use contain to isolate layout, style, and paint
    container.style.contain = "layout style paint";
    
    // Ensure hardware acceleration
    container.style.willChange = "transform";
    container.style.transform = "translateZ(0)";
    container.style.backfaceVisibility = "hidden";
    container.style.perspective = "1000px";

    // Prevent any layout-affecting properties
    container.style.position = "relative";

    return () => {
      // Cleanup if needed
      if (container) {
        container.style.contain = "auto";
        container.style.willChange = "auto";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        isolation: "isolate", // Create stacking context
      }}
    >
      {children}
    </div>
  );
}
