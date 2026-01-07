"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { socialLinks } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const socialIconVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/5 to-accent-purple/10 pointer-events-none" />
      
      {/* Animated Blur Orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Divider with Gradient */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent mb-20 origin-center"
        />

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center space-y-16"
        >
          {/* Name and Role */}
          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <h3 className="text-5xl md:text-7xl font-bold gradient-text mb-4">
                Arpit Bhardwaj
              </h3>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-foreground-muted font-light tracking-wide">
                Full Stack Developer & AI Enthusiast
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-2 mt-6"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(0, 212, 255, 0.7)",
                    "0 0 0 20px rgba(0, 212, 255, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-3 h-3 rounded-full bg-accent-blue"
              />
              <span className="text-accent-blue text-sm font-medium">Open to opportunities</span>
            </motion.div>
          </div>

          {/* Social Links with Premium Styling */}
          <motion.div variants={itemVariants}>
            <div className="flex gap-6 justify-center flex-wrap">
              {Object.entries(socialLinks).map(([platform, url], index) => {
                const getIcon = (platform: string) => {
                  switch (platform.toLowerCase()) {
                    case "github":
                      return (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      );
                    case "linkedin":
                      return (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      );
                    case "email":
                      return (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      );
                    default:
                      return null;
                  }
                };

                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={socialIconVariants}
                    whileHover={{
                      scale: 1.2,
                      y: -8,
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    className="relative group"
                    aria-label={platform}
                  >
                    {/* Glow Background */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(0, 212, 255, 0.3)",
                          "0 0 40px rgba(168, 85, 247, 0.3)",
                          "0 0 20px rgba(0, 212, 255, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    />

                    {/* Icon Container */}
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:border-white/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15">
                      <div className="text-accent-blue group-hover:text-accent-purple transition-colors duration-300">
                        {getIcon(platform)}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />

          {/* Footer Bottom */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-foreground-muted"
          >
            <p className="font-light">
              © {currentYear} Arpit Bhardwaj. All rights reserved.
            </p>

            <div className="flex gap-4 text-xs">
              <motion.a
                href="#"
                whileHover={{ color: "#00d4ff" }}
                className="hover:text-accent-blue transition-colors"
              >
                Privacy Policy
              </motion.a>
              <span>•</span>
              <motion.a
                href="#"
                whileHover={{ color: "#00d4ff" }}
                className="hover:text-accent-blue transition-colors"
              >
                Terms of Service
              </motion.a>
            </div>

            <p className="font-light">
              Crafted with <span className="text-accent-purple">♥</span> using Next.js
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

