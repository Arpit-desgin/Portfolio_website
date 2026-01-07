"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { skills } from "@/lib/constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Technology icons mapping
const techIcons: { [key: string]: string } = {
  React: "⚛️",
  "Next.js": "▲",
  TypeScript: "📘",
  "Tailwind CSS": "🎨",
  "Node.js": "🟢",
  Python: "🐍",
  "Framer Motion": "✨",
  JavaScript: "🟨",
  MongoDB: "🍃",
  MySQL: "🐬",
  Git: "📦",
  Docker: "🐳",
};

// Technology stack for the grid
const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "MongoDB",
  "MySQL",
  "Tailwind CSS",
  "Framer Motion",
  "Git",
  "Docker",
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);
  const techGridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Skip scroll animations on mobile for better performance
    if (isMobile) return;

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
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate skill cards with stagger
      if (skillsGridRef.current) {
        const cards = skillsGridRef.current.querySelectorAll(".skill-card");
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: skillsGridRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate progress bars
        cards.forEach((card, index) => {
          const progressBar = card.querySelector(".progress-bar");
          const skill = skills[index];
          if (progressBar && skill) {
            gsap.fromTo(
              progressBar,
              {
                width: "0%",
              },
              {
                width: `${skill.level}%`,
                duration: 1.5,
                delay: 0.3 + index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        });
      }

      // Animate technology grid with stagger
      if (techGridRef.current) {
        const techCards = techGridRef.current.querySelectorAll(".tech-card");
        gsap.fromTo(
          techCards,
          {
            opacity: 0,
            scale: 0.8,
            rotation: -10,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: techGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="Skills section"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.03),transparent_70%)]" />

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
            Skills
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon mx-auto rounded-full" />
        </motion.div>

        {/* Skills Progress Cards Grid */}
        <div
          ref={skillsGridRef}
          className="grid md:grid-cols-2 gap-6 mb-20"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="skill-card p-8 rounded-2xl glass shadow-soft relative overflow-hidden group"
              whileHover={{
                scale: 1.03,
                rotate: 1,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/0 via-accent-purple/10 to-accent-neon/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-foreground">
                    {skill.name}
                  </span>
                  <span className="text-sm text-foreground-muted font-medium">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-background-charcoal/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="progress-bar h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon rounded-full shadow-glow"
                    initial={{ width: 0 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technologies Grid */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h3 className="text-heading-2 font-semibold text-center mb-12 text-foreground">
            Technologies I Work With
          </h3>
          <div
            ref={techGridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {technologies.map((tech) => (
              <motion.div
                key={tech}
                className="tech-card p-6 rounded-2xl glass border border-white/10 shadow-soft text-center cursor-default relative overflow-hidden group"
                whileHover={{
                  scale: 1.1,
                  rotate: -2,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-accent-purple opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="text-3xl mb-3">{techIcons[tech] || "💻"}</div>
                  <div className="text-sm font-medium text-foreground-muted group-hover:text-foreground transition-colors">
                    {tech}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
