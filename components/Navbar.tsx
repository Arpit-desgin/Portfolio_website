"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { navLinks } from "@/lib/constants";
import { isMobileDevice, throttle } from "@/lib/performanceUtils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  // Detect mobile once
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // OPTIMIZED: Use motion event listener on desktop only
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMobile) return; // Skip on mobile
    setIsScrolled(latest > 50);
  });

  // OPTIMIZED: Detect active section with throttling on desktop only
  useEffect(() => {
    if (isMobile) return; // Skip expensive DOM queries on mobile

    const handleActiveSection = throttle(() => {
      const sections = navLinks.map((link) => {
        const element = document.querySelector(link.href);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id: link.href,
            top: rect.top,
            bottom: rect.bottom,
          };
        }
        return null;
      }).filter(Boolean);

      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && scrollPosition >= section.top) {
          setActiveSection(section.id);
          break;
        }
      }

      if (window.scrollY < 100) {
        setActiveSection("#home");
      }
    }, 100); // Throttle to 100ms

    window.addEventListener("scroll", handleActiveSection, { passive: true });
    handleActiveSection();

    return () => window.removeEventListener("scroll", handleActiveSection);
  }, [isMobile]);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      // Close mobile menu first
      setIsMobileMenuOpen(false);
      
      // Use scrollIntoView which works with Lenis smooth scroll
      // Add a small delay to ensure menu animation completes
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-0 right-0 z-50 rounded-2xl transition-all duration-300 ${
        isScrolled
          ? "glass-strong shadow-soft border border-white/10"
          : "glass border border-white/5"
      }`}
      style={{
        width: "95%",
        maxWidth: "1536px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
          <div className="px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-16">
              {/* Logo - Left */}
              <motion.a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#home");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavClick("#home");
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xl font-bold gradient-text-neon cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-background rounded-lg"
                aria-label="Go to home section"
              >
                Portfolio
              </motion.a>

              {/* Desktop Menu - Right */}
              <div className="hidden md:flex items-center space-x-8">
                  {navLinks.map((link, index) => {
                    const isActive = activeSection === link.href;
                    return (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleNavClick(link.href);
                          }
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -2 }}
                        className={`relative text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-background rounded px-2 py-1 ${
                          isActive
                            ? "text-foreground"
                            : "text-foreground-muted hover:text-foreground"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {link.name}
                        {/* Active indicator */}
                        <motion.span
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                        {/* Hover underline */}
                        <motion.span
                          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </motion.a>
                    );
                  })}
                </div>

              {/* Mobile Menu Button (absolute to right) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="md:hidden text-foreground-muted hover:text-foreground transition-colors p-2 rounded-xl hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-background absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <motion.svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-white/10 overflow-hidden"
            role="menu"
            aria-label="Mobile navigation menu"
          >
                <div className="px-6 py-4 space-y-2">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.href;
                    return (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`block py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "text-foreground bg-white/10"
                            : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        {link.name}
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
  );
}