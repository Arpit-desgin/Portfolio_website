"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "hover" | "click">("default");
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let animationFrameId: number | null = null;
    let isActive = true;

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      if (!isActive) return;
      
      // Smooth cursor following with easing (optimized for 60fps)
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      setPosition({ x: cursorX, y: cursorY });

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
        setIsHovering(true);
        setCursorType("hover");
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorType("default");
    };

    const handleMouseDown = () => {
      setCursorType("click");
    };

    const handleMouseUp = () => {
      setCursorType(isHovering ? "hover" : "default");
    };

    window.addEventListener("mousemove", updateCursor, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    // Detect interactive elements with MutationObserver for dynamic content
    const interactiveSelectors = "a, button, [role='button'], input, textarea, select, [data-cursor='hover']";
    let interactiveElements = document.querySelectorAll(interactiveSelectors);
    
    const attachListeners = () => {
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
        el.addEventListener("mouseleave", handleMouseLeave, { passive: true });
      });
    };

    attachListeners();

    // Watch for new interactive elements
    const observer = new MutationObserver(() => {
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      interactiveElements = document.querySelectorAll(interactiveSelectors);
      attachListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    animateCursor();

    return () => {
      isActive = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  // Animate cursor size changes
  useEffect(() => {
    if (cursorRef.current) {
      const scale = cursorType === "click" ? 0.8 : isHovering ? 2.2 : 1;
      gsap.to(cursorRef.current, {
        scale,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      });
    }
  }, [isHovering, cursorType]);

  // Hide cursor on mobile/touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Outer cursor ring - GPU accelerated */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-accent-blue/30 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{
          transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0)`,
        }}
        aria-hidden="true"
      />
      {/* Inner cursor dot - GPU accelerated */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
