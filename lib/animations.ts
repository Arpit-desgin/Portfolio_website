import { Variants } from "framer-motion";
import { isMobileDevice, shouldReduceAnimations } from "./performanceUtils";

// Consistent easing curve for 60fps performance (cubic-bezier for smooth motion)
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeInOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const easeSpring: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

// Get animation duration based on device performance
const getAnimationDuration = (baseDesktop: number, baseMobile: number = 0.4) => {
  if (isMobileDevice()) return baseMobile;
  if (shouldReduceAnimations()) return baseDesktop * 0.7;
  return baseDesktop;
};

// Get stagger delay based on device
const getStaggerDelay = () => {
  return isMobileDevice() ? 0.03 : 0.08;
};

export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(0.6, 0.4),
      ease: easeOut,
    },
  },
};

export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: getAnimationDuration(0.6, 0.35),
      ease: easeOut,
    },
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: getStaggerDelay(),
      delayChildren: 0.2,
      ease: easeOut,
    },
  },
};

export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -80,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getAnimationDuration(0.6, 0.4),
      ease: easeOut,
    },
  },
};

export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 80,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getAnimationDuration(0.6, 0.4),
      ease: easeOut,
    },
  },
};

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getAnimationDuration(0.5, 0.3),
      ease: easeOut,
    },
  },
};

export const scaleInSpring: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getAnimationDuration(0.6, 0.4),
      ease: easeSpring,
    },
  },
};

export const slideUp: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(0.5, 0.3),
      ease: easeOut,
    },
  },
};

export const fadeInScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getAnimationDuration(0.4, 0.25),
      ease: easeOut,
    },
  },
};

