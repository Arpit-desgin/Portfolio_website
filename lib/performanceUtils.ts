/**
 * Performance utilities for mobile-first optimization
 * Ensures 60fps scrolling and smooth interactions on all devices
 */

// Mobile device detection - strict and reliable
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check screen width (primary indicator)
  if (window.innerWidth <= 768) return true;
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|android|webos|blackberry|windows phone|opera mini/.test(userAgent);
};

// Tablet detection (treat as mobile for heavy animations)
export const isTablet = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Should reduce animations based on device type
export const shouldReduceAnimations = (): boolean => {
  if (typeof window === "undefined") return true;
  
  // Mobile devices should have reduced animations
  if (isMobileDevice()) return true;
  
  // Check for prefers-reduced-motion
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Check if device has enough GPU for heavy animations
export const hasGoodGPU = (): boolean => {
  if (typeof window === "undefined") return false;
  
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
    if (!gl) return false;
    
    // Type assertion for WebGL context
    const webglContext = gl as WebGLRenderingContext;
    const debugInfo = webglContext.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo 
      ? webglContext.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL) 
      : "unknown";
    
    // Consider lower-end devices as low GPU
    const lowEndKeywords = ["mali", "adreno", "powervr"];
    return !lowEndKeywords.some(keyword => 
      renderer.toString().toLowerCase().includes(keyword)
    );
  } catch {
    // If WebGL detection fails, assume good GPU (safer default)
    return true;
  }
};

// Get recommended animation settings based on device
export const getAnimationConfig = () => {
  const isMobile = isMobileDevice();
  const isTabletDevice = isTablet();
  const shouldReduce = shouldReduceAnimations();
  
  return {
    isMobile,
    isTablet: isTabletDevice,
    shouldReduceAnimations: shouldReduce,
    // Animation durations
    shortDuration: isMobile ? 0.3 : 0.4,
    standardDuration: isMobile ? 0.5 : 0.6,
    longDuration: isMobile ? 0.8 : 1.2,
    // Stagger delays
    staggerDelay: isMobile ? 0.05 : 0.08,
    // Enable/disable features
    enableSpline: !isMobile, // Disable Spline on mobile
    enableParallax: !isMobile && !shouldReduce, // Disable parallax on mobile
    enableScrollAnimations: !isMobile && !shouldReduce, // Disable heavy scroll animations on mobile
    enableCursor: !isMobile, // Disable cursor effects on touch devices
    enableBackdropFilter: !isMobile, // Disable blur effects on mobile
  };
};

// Throttle function for scroll/resize events
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean = false;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Debounce function
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Performance monitoring
export const measurePerformance = (label: string) => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    if (duration > 16.67) {
      // Frame drops below 60fps if over 16.67ms
      console.warn(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
    }
  };
};

// Check if page is idle (no scrolling for 2 seconds)
export const onPageIdle = (callback: Function, idleTime = 2000) => {
  let timeoutId: NodeJS.Timeout;
  
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, idleTime);
  };
  
  window.addEventListener("scroll", resetTimer, { passive: true });
  window.addEventListener("mousemove", resetTimer, { passive: true });
  
  resetTimer(); // Initial timer
  
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener("scroll", resetTimer);
    window.removeEventListener("mousemove", resetTimer);
  };
};

// Export all utilities
export const performanceConfig = {
  isMobileDevice,
  isTablet,
  shouldReduceAnimations,
  hasGoodGPU,
  getAnimationConfig,
  throttle,
  debounce,
  measurePerformance,
  onPageIdle,
};
