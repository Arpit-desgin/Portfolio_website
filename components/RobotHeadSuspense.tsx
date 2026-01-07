"use client";

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

// High-quality Suspense fallback loader
function RobotFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-accent-purple/5 to-accent-neon/5 rounded-2xl" />
      
      {/* Main loader */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Spinning 3D-looking loader */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-accent-blue/30 rounded-full animate-spin" 
               style={{ animationDuration: '2s' }} />
          
          {/* Middle ring */}
          <div className="absolute inset-2 border-4 border-transparent border-r-accent-purple/40 rounded-full animate-spin"
               style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          
          {/* Inner ring */}
          <div className="absolute inset-4 border-4 border-transparent border-b-accent-neon/50 rounded-full animate-spin"
               style={{ animationDuration: '1s' }} />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-3 h-3 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <motion.p 
            className="text-foreground text-sm font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing 3D Experience
          </motion.p>
          <div className="flex gap-1">
            <motion.span
              className="w-2 h-2 bg-accent-blue rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="w-2 h-2 bg-accent-purple rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-2 h-2 bg-accent-neon rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lazy load the optimized RobotHead component
const RobotHeadOptimized = lazy(() => import("./RobotHeadOptimized").then(module => ({
  default: module.default
})));

interface RobotHeadSuspenseProps {
  modelPath?: string;
  reducedMotion?: boolean;
}

export default function RobotHeadSuspense({ 
  modelPath,
  reducedMotion 
}: RobotHeadSuspenseProps) {
  return (
    <Suspense fallback={<RobotFallback />}>
      <RobotHeadOptimized 
        modelPath={modelPath}
        reducedMotion={reducedMotion}
      />
    </Suspense>
  );
}

