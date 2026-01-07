"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

// Lazy load SplineViewer for 3D robot scene
const SplineViewer = dynamic(() => import("./SplineViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-accent-purple/5 to-accent-neon/5 rounded-2xl" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
        <p className="text-foreground-muted text-sm">Loading 3D scene...</p>
      </div>
    </div>
  ),
});

// Enhanced CTA Button Component with glow effect
function CTAButton({
  children,
  href,
  className,
  variant = "primary",
  download,
  target,
  rel,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
  download?: boolean;
  target?: string;
  rel?: string;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const baseClasses =
    variant === "primary"
      ? "px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl text-white font-semibold shadow-lg hover:shadow-glow transition-all duration-300 text-base relative overflow-hidden group"
      : variant === "secondary"
      ? "px-8 py-4 glass rounded-2xl text-foreground font-semibold border border-white/10 hover:border-accent-purple/50 hover:bg-white/5 transition-all duration-300 text-base relative overflow-hidden group"
      : "px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-neon rounded-2xl text-white font-semibold shadow-lg hover:shadow-glow transition-all duration-300 text-base relative overflow-hidden group";

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      download={download}
      target={target}
      rel={rel}
      whileHover={{ 
        scale: 1.05,
        boxShadow: variant === "primary" || variant === "tertiary" 
          ? "0 0 30px rgba(59, 130, 246, 0.5)" 
          : "0 0 20px rgba(168, 85, 247, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses + " " + className}
    >
      <span className="relative z-10">{children}</span>
      {(variant === "primary" || variant === "tertiary") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent-neon via-accent-blue to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      )}
    </motion.a>
  );
}

// Animated Text Component (word-by-word reveal)
function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showRobot, setShowRobot] = useState(true);
  const [shouldLoadRobot, setShouldLoadRobot] = useState(false);
  const robotContainerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Detect mobile and performance capabilities
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      // Show robot on all devices, but scale down on mobile
      setShowRobot(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer for lazy loading the Spline scene
  useEffect(() => {
    if (!showRobot || !robotContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Start loading when container is 300px away from viewport
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight + 300) {
            setShouldLoadRobot(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "300px", // Start loading 300px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(robotContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [showRobot]);

  useEffect(() => {
    // Animated background gradient with GSAP
    if (backgroundRef.current && !isMobile) {
      gsap.to(backgroundRef.current, {
        backgroundPosition: "200% 200%",
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }

    // Floating particles effect - disable on mobile
    if (!isMobile) {
      const particles = document.querySelectorAll(".particle");
      particles.forEach((particle, index) => {
        gsap.to(particle, {
          y: "random(-100, 100)",
          x: "random(-100, 100)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });
    }
  }, [isMobile]);

  const handleScrollClick = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="h-screen flex items-center justify-center relative overflow-hidden pt-24 md:pt-32 lg:pt-40"
      aria-label="Hero section"
    >
      {/* Animated Background Gradient */}
      <motion.div
        ref={backgroundRef}
        style={{
          y: backgroundY,
          opacity,
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 0%",
        }}
        className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-neon/10"
      />

      {/* Animated Radial Gradients */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,212,255,0.15),transparent_50%)]"
      />
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]"
      />
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.1),transparent_70%)]"
      />

      {/* Floating Particles - disabled on mobile */}
      {!isMobile && [...Array(6)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple opacity-20 blur-sm"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}

      {/* Main Content Container - Centered Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Centered Spline 3D Robot */}
          {showRobot && (
            <motion.div
              ref={robotContainerRef}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full max-w-2xl h-[260px] sm:h-[340px] md:h-[420px] lg:h-[520px] relative z-10 mb-2 sm:mb-4 md:mb-6"
              style={{ 
                minHeight: "220px",
                maxWidth: "100%",
                overflow: "hidden"
              }}
            >
              {shouldLoadRobot ? (
                <SplineViewer 
                  url="https://prod.spline.design/xmzrRDQRUBRdR3JQ/scene.splinecode"
                  reducedMotion={isMobile}
                  className="rounded-2xl overflow-hidden"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-accent-purple/5 to-accent-neon/5 rounded-2xl" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
                    <p className="text-foreground-muted text-sm">Preparing 3D scene...</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Three CTA Buttons - Centered Below Robot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 items-stretch sm:items-center justify-center w-full max-w-4xl px-4 mb-16 sm:mb-20 md:mb-24"
          >
            <CTAButton href="#projects" variant="primary" className="w-full sm:w-auto min-w-[180px] text-center">
              View My Work
            </CTAButton>
            <CTAButton href="/Arpit_Bhardwaj_Resume.pdf" target="_blank" rel="noopener noreferrer" variant="secondary" download className="w-full sm:w-auto min-w-[180px] text-center">
              Download CV
            </CTAButton>
            <CTAButton href="#experience" variant="tertiary" className="w-full sm:w-auto min-w-[180px] text-center">
              View Experience
            </CTAButton>
          </motion.div>
        </div>
      </div>


    </section>
  );
}
