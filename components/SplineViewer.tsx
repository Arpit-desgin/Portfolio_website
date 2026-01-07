"use client";

import { useEffect, useRef, useState } from "react";

interface SplineViewerProps {
  url: string;
  className?: string;
  reducedMotion?: boolean;
}

export default function SplineViewer({ 
  url, 
  className = "",
  reducedMotion = false 
}: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    // Load Spline script only once
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
        // Cleanup if component unmounts before script loads
        if (!scriptLoadedRef.current) {
          document.head.removeChild(script);
        }
      };
    } else {
      // Script already loaded
      setIsLoading(false);
    }
  }, []);

  // Wait for SplineViewer to be available in the DOM
  useEffect(() => {
    if (isLoading || hasError || !scriptLoadedRef.current || !containerRef.current) return;

    // Check if spline-viewer custom element is defined
    const checkAndRender = () => {
      if (customElements.get("spline-viewer")) {
        // Custom element is defined, create the viewer
        const viewer = document.createElement("spline-viewer");
        viewer.setAttribute("url", url);
        viewer.setAttribute("loading", "lazy");
        
        // Style the viewer (remove default background, make it transparent)
        viewer.style.width = "100%";
        viewer.style.height = "100%";
        viewer.style.display = "block";
        viewer.style.background = "transparent";
        viewer.style.border = "none";
        viewer.style.outline = "none";
        viewer.style.pointerEvents = "auto";
        
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
        // Wait a bit and try again (max 30 attempts = 3 seconds)
        if (typeof window !== "undefined" && (window as any).__splineRetries < 30) {
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
  }, [isLoading, hasError, url]);

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

