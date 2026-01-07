"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { experiences } from "@/lib/constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<HTMLDivElement>(null);

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

      // Progressive timeline line drawing
      if (timelineLineRef.current && timelineItemsRef.current) {
        const items = timelineItemsRef.current.querySelectorAll(".timeline-item");
        const totalHeight = timelineItemsRef.current.offsetHeight;

        gsap.fromTo(
          timelineLineRef.current,
          {
            scaleY: 0,
            transformOrigin: "top",
          },
          {
            scaleY: 1,
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              end: `+=${totalHeight}`,
              scrub: 1,
            },
          }
        );
      }

      // Animate timeline dots
      if (timelineItemsRef.current) {
        const dots = timelineItemsRef.current.querySelectorAll(".timeline-dot");
        gsap.fromTo(
          dots,
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: [0.16, 1, 0.3, 1],
            scrollTrigger: {
              trigger: timelineItemsRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate experience cards with stagger
      if (timelineItemsRef.current) {
        const cards = timelineItemsRef.current.querySelectorAll(".experience-card");
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            x: (index) => (index % 2 === 0 ? -60 : 60),
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: [0.16, 1, 0.3, 1],
            scrollTrigger: {
              trigger: timelineItemsRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="Experience section"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,212,255,0.03),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.03),transparent_60%)]" />

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
            Experience
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon mx-auto rounded-full" />
        </motion.div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative">
          {/* Timeline Line - Progressive Drawing */}
          <div
            ref={timelineLineRef}
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-blue via-accent-purple to-accent-neon transform md:-translate-x-1/2 rounded-full origin-top"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Timeline Items */}
          <div ref={timelineItemsRef} className="space-y-20">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative flex items-start ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full transform -translate-x-1/2 z-20 shadow-glow border-2 border-background timeline-dot" />

                {/* Experience Card */}
                <div
                  className={`w-full md:w-[calc(50%-3rem)] experience-card ${
                    index % 2 === 0 ? "md:pr-16 pl-20" : "md:pl-16 pr-20 md:ml-auto"
                  }`}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="p-8 rounded-2xl glass shadow-soft hover:shadow-glow transition-all duration-300"
                  >
                    {/* Period Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-4 py-1.5 rounded-full glass border border-accent-purple/30 text-accent-purple text-sm font-medium">
                        {exp.period}
                      </span>
                    </div>

                    {/* Title and Company */}
                    <h3 className="text-heading-2 font-semibold text-foreground mb-2">
                      {exp.title}
                    </h3>
                    <h4 className="text-heading-3 text-accent-blue mb-4 font-medium">
                      {exp.company}
                    </h4>

                    {/* Description */}
                    <p className="text-foreground-muted mb-6 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-xs rounded-xl glass border border-white/10 text-accent-blue font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
