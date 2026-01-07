"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { projects } from "@/lib/constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectModal from "./ProjectModal";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate project cards with cinematic stagger
      if (projectsGridRef.current) {
        const cards = projectsGridRef.current.querySelectorAll(".project-card");
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 100,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: [0.16, 1, 0.3, 1],
            scrollTrigger: {
              trigger: projectsGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  const handleProjectClick = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        aria-label="Projects section"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.05),transparent_60%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <motion.div
            ref={titleRef}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-display-2 font-bold mb-6 gradient-text">
              Featured Projects
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon mx-auto rounded-full" />
            <p className="text-foreground-muted mt-6 text-lg max-w-2xl mx-auto">
              A collection of my best work, showcasing creativity and technical
              expertise
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div
            ref={projectsGridRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card group relative rounded-3xl overflow-hidden glass shadow-soft cursor-pointer"
                whileHover={{
                  y: -16,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                }}
                onClick={() => handleProjectClick(project)}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-neon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10" />

                {/* Project Image Container */}
                <div className="relative h-64 md:h-72 overflow-hidden">
                  {project.image ? (
                    <motion.div
                      className="absolute inset-0 w-full h-full"
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover rounded-2xl"
                        priority={project.id === 1}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-neon/20"
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-foreground-muted text-sm">
                          {project.title} Preview
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Overlay gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  {/* View Project Badge */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    <div className="px-4 py-2 rounded-xl glass border border-white/20 backdrop-blur-sm">
                      <span className="text-white text-sm font-medium flex items-center gap-2">
                        View Project
                        <svg
                          className="w-4 h-4"
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
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Project Content */}
                <div className="p-6 md:p-8 relative z-10">
                  <motion.h3
                    className="text-heading-2 font-semibold text-foreground mb-3 group-hover:text-accent-blue transition-colors duration-300"
                    whileHover={{ x: 4 }}
                  >
                    {project.title}
                  </motion.h3>

                  <p className="text-foreground-muted mb-6 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs rounded-xl glass border border-white/10 text-accent-blue font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1.5 text-xs rounded-xl glass border border-white/10 text-foreground-muted font-medium">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View Project Button */}
                  <div className="pt-4 border-t border-white/10">
                    <motion.button
                      onClick={() => handleProjectClick(project)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 hover:from-accent-blue/30 hover:to-accent-purple/30 rounded-lg text-accent-blue font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      View Project Details
                      <svg
                        className="w-4 h-4"
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
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
