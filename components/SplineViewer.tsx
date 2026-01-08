"use client";

import { useEffect, useRef, useState } from "react";
import { isMobileDevice } from "@/lib/performanceUtils";

interface SplineViewerProps {
  url: string;
  className?: string;
  reducedMotion?: boolean;
  performanceMode?: boolean;
}

export default function SplineViewer({ 
  url, 
  className = "",
  reducedMotion = false,
  performanceMode = false
}: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const scriptLoadedRef = useRef(false);
  const isMobile = isMobileDevice();

  // Load Spline script only once
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@1.12.28/build/spline-viewer.js";
      script.async = true;
      
      script.onload = () => {
        scriptLoadedRef.current = true;
        setIsLoading(false);
      };
      
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
      
      return () => {
        if (!scriptLoadedRef.current) {
          try {
            document.head.removeChild(script);
          } catch (e) {
            // Already removed
          }
        }
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  // CRITICAL: IntersectionObserver to pause Spline when off-screen
  // This prevents continuous rendering when not visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is visible
            setIsVisible(true);
          } else {
            // Element is off-screen - pause rendering
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "100px",
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Render Spline viewer with performance optimizations
  useEffect(() => {
    if (isLoading || hasError || !scriptLoadedRef.current || !containerRef.current || !isVisible) return;

    // Check if spline-viewer custom element is defined
    const checkAndRender = () => {
      if (customElements.get("spline-viewer")) {
        // Create the viewer
        const viewer = document.createElement("spline-viewer");
        viewer.setAttribute("url", url);
        viewer.setAttribute("loading", "lazy");
        
        // PERFORMANCE OPTIMIZATION: Lower quality on mobile
        if (isMobile) {
          // Disable interactions on mobile (no hover, drag, etc.)
          viewer.setAttribute("disable-camera-controls", "true");
          viewer.style.pointerEvents = "none"; // Disable interaction
        }
        
        // Style the viewer
        viewer.style.width = "100%";
        viewer.style.height = "100%";
        viewer.style.display = "block";
        viewer.style.background = "transparent";
        viewer.style.border = "none";
        viewer.style.outline = "none";
        viewer.style.pointerEvents = isMobile ? "none" : "auto";
        
        // Store reference to control rendering
        viewerRef.current = viewer;
        
        // Add global styles for spline-viewer if not already added
        if (!document.getElementById("spline-viewer-styles")) {
          const style = document.createElement("style");
          style.id = "spline-viewer-styles";
          style.textContent = `
            spline-viewer {
              width: 100% !important;
              height: 100% !important;
              background: transparent !important;
              border: none !important;
              outline: none !important;
              display: block !important;
            }
            spline-viewer canvas {
              background: transparent !important;
              ${isMobile ? "image-rendering: auto !important;" : ""}
            }
          `;
          document.head.appendChild(style);
        }
        
        // Clear container and add viewer
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(viewer);
        }
      } else {
        // Wait a bit and try again
        if ((window as any).__splineRetries < 30) {
          (window as any).__splineRetries = ((window as any).__splineRetries || 0) + 1;
          setTimeout(checkAndRender, 100);
        } else {
          setHasError(true);
        }
      }
    };

    if (typeof window !== "undefined") {
      (window as any).__splineRetries = 0;
    }
    checkAndRender();
  }, [isLoading, hasError, url, isVisible, isMobile]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center relative ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-accent-purple/5 to-accent-neon/5 rounded-2xl" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
          <p className="text-foreground-muted text-sm">Loading 3D scene...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center relative ${className}`}
      >
        <div className="text-foreground-muted text-sm text-center p-4">
          Failed to load 3D scene
        </div>
      </div>
    );
  }

  // Render container for Spline viewer
  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative ${className}`}
      style={{
        background: "transparent",
        overflow: "hidden",
      }}
    />
  );
}

