"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  gallery?: ProjectImage[];
  technologies: string[];
  link: string;
  github: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll but allow modal scroll
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Handle arrow keys for image navigation
      if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle swipe navigation
  const handleSwipeStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart && e.changedTouches[0].clientX) {
      const distance = touchStart - e.changedTouches[0].clientX;
      if (distance > 50) {
        // Swipe left - next image
        handleNextImage();
      } else if (distance < -50) {
        // Swipe right - previous image
        handlePrevImage();
      }
    }
  };

  const handleNextImage = () => {
    if (project?.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % project.gallery!.length);
    }
  };

  const handlePrevImage = () => {
    if (project?.gallery) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.gallery!.length - 1 : prev - 1
      );
    }
  };

  if (!project) return null;

  const galleryImages = project.gallery || [{ src: project.image, alt: project.title, caption: "Main Image" }];
  const currentImage = galleryImages[currentImageIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-6xl mx-auto glass-strong rounded-3xl shadow-glow overflow-hidden flex flex-col max-h-[90vh]">
              {/* Close Button - Fixed Position with Dark Background */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group bg-black/60 hover:bg-black/80 border border-white/30 hover:border-white/60 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Project Image Gallery */}
              <div
                className="relative h-64 md:h-96 w-full overflow-hidden bg-black/40"
                onTouchStart={handleSwipeStart}
                onTouchEnd={handleSwipeEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentImage.src}
                      alt={currentImage.alt}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 90vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Image Caption */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6"
                >
                  <p className="text-white text-lg font-semibold">
                    {currentImage.caption}
                  </p>
                </motion.div>

                {/* Navigation Arrows - Desktop with Dark Background */}
                {galleryImages.length > 1 && (
                  <>
                    <motion.button
                      onClick={handlePrevImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hidden md:flex bg-black/60 hover:bg-black/80 border border-white/30 hover:border-white/60 backdrop-blur-sm"
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </motion.button>

                    <motion.button
                      onClick={handleNextImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hidden md:flex bg-black/60 hover:bg-black/80 border border-white/30 hover:border-white/60 backdrop-blur-sm"
                      aria-label="Next image"
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>

                    {/* Image Counter */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full glass border border-white/20 backdrop-blur-sm"
                    >
                      <span className="text-white text-sm font-medium">
                        {currentImageIndex + 1} / {galleryImages.length}
                      </span>
                    </motion.div>
                  </>
                )}

                {/* Image Thumbnails */}
                {galleryImages.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2"
                  >
                    {galleryImages.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "bg-accent-blue w-8"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Project Content - Scrollable */}
              <div 
                className="p-8 md:p-12 overflow-y-auto flex-1" 
                style={{ 
                  scrollBehavior: 'smooth',
                  overscrollBehavior: 'contain'
                }}
                onWheel={(e) => {
                  // Allow natural wheel scrolling
                  e.stopPropagation();
                }}
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-display-3 font-bold gradient-text mb-6"
                >
                  {project.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg text-foreground-muted leading-relaxed mb-8"
                >
                  {project.description}
                </motion.p>

                {/* Technologies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <h3 className="text-heading-3 font-semibold text-foreground mb-4">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 rounded-xl glass border border-white/10 text-accent-blue font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex justify-center mt-8"
                >
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-white font-semibold shadow-glow hover:shadow-glow-hover transition-all duration-300 text-center"
                  >
                    View Live Demo
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

