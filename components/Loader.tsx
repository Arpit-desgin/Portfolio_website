"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if loader has been shown before (only on client)
    if (typeof window === "undefined") return;
    
    const hasSeenLoader = localStorage.getItem("hasSeenLoader");
    
    if (hasSeenLoader === "true") {
      // Skip loader if already seen
      setIsVisible(false);
      setTimeout(() => onComplete(), 100);
      return;
    }

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Complete animation after 2 seconds
    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Mark as seen (only on client)
      if (typeof window !== "undefined") {
        localStorage.setItem("hasSeenLoader", "true");
      }
      
      // Fade out
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onComplete(), 500);
      }, 500);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-neon/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.15),transparent_70%)]" />

          {/* Floating Particles */}
          {typeof window !== "undefined" &&
            [...Array(8)].map((_, i) => {
              const initialX = Math.random() * (window.innerWidth || 1920);
              const initialY = Math.random() * (window.innerHeight || 1080);
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple opacity-30"
                  initial={{
                    x: initialX,
                    y: initialY,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.random() * (window.innerWidth || 1920),
                    y: Math.random() * (window.innerHeight || 1080),
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              );
            })}

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Logo/Name Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold gradient-text-neon mb-4"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Portfolio
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-foreground-muted text-lg md:text-xl"
              >
                Loading Experience
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 md:w-80 mx-auto">
              <div className="h-1 bg-background-charcoal/50 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-foreground-muted text-sm"
              >
                {progress}%
              </motion.p>
            </div>

            {/* Loading Text Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <motion.p
                className="text-foreground-muted text-sm"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Preparing your experience...
              </motion.p>
            </motion.div>
          </div>

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 border-2 border-accent-blue/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

