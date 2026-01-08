"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const floatingShapeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Skip scroll animations on mobile for better performance
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Animate title on scroll
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
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate text paragraphs with stagger
      if (textRef.current) {
        const paragraphs = textRef.current.querySelectorAll("p");
        gsap.fromTo(
          paragraphs,
          {
            opacity: 0,
            x: -80,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
              end: "top 40%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Parallax effect for image container
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Floating animation for abstract shape
      if (floatingShapeRef.current) {
        gsap.to(floatingShapeRef.current, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "random(-15, 15)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Animate stats on scroll
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-card");
        gsap.fromTo(
          statCards,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              end: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate numbers counting up with timeline
        statCards.forEach((card, index) => {
          const numberElement = card.querySelector(".stat-number") as HTMLElement;
          if (numberElement && numberElement.textContent) {
            const originalText = numberElement.textContent.trim();
            // Extract numeric value from text like "10+", "15+", "100+"
            const numericValue = parseInt(originalText.match(/\d+/)?.[0] || "0", 10);
            const hasPlusSign = originalText.includes("+");

            // Format number function
            const formatNumber = (num: number) => {
              return hasPlusSign ? `${num}+` : `${num}`;
            };

            // Create counter object for GSAP animation
            const counterObj = { value: 0 };

            // Create a timeline to ensure animation fires
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                once: true,
                onEnter: () => {
                  // Animation will start automatically with timeline
                },
              },
            });

            tl.to(counterObj, {
              value: numericValue,
              duration: 2.5,
              ease: "power2.out",
              onUpdate: () => {
                const currentValue = Math.floor(counterObj.value);
                if (numberElement) {
                  numberElement.textContent = formatNumber(currentValue);
                }
              },
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="About section"
      suppressHydrationWarning
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(0,212,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(168,85,247,0.05),transparent_50%)]" />

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
            About Me
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon mx-auto rounded-full" />
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div ref={textRef} className="space-y-8">
            <p className="text-lg md:text-xl text-white leading-relaxed">
              I’m a passionate full-stack developer who enjoys building clean,
              beautiful, and functional web applications. Through hands-on
              projects and continuous learning, I turn ideas into polished digital
              experiences using modern web technologies.
            </p>
            <p className="text-lg md:text-xl text-white leading-relaxed">
              My journey into web development began with a curiosity about how things
              work behind the scenes. Since then, I’ve been focused on learning how
              to build scalable, performant, and user-friendly applications while
              strengthening my problem-solving and development skills.
            </p>
            <p className="text-lg md:text-xl text-white leading-relaxed">
              When I’m not coding, I enjoy exploring new technologies, working on
              personal projects, contributing to open-source when I can, and
              learning from the developer community.
            </p>
          </div>

          {/* Image/Abstract Visual */}
          <div ref={imageRef} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden glass shadow-soft hover:shadow-glow transition-all duration-500 group"
            >
              {/* Abstract Visual Elements - Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-neon/10" />
              
              {/* Floating Shape - Subtle background glow */}
              <div
                ref={floatingShapeRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 blur-3xl pointer-events-none"
              />

              {/* Profile Photo Container */}
              <div className="relative z-20 h-full flex items-center justify-center p-6 md:p-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <div className="relative w-[70%] md:w-[75%] aspect-square max-w-xs">
                    <Image
                      src="/images/profile/arpit.jpg"
                      alt="Arpit - Full Stack Developer"
                      fill
                      priority
                      quality={95}
                      className="object-cover rounded-2xl shadow-lg"
                      sizes="(max-width: 768px) 70vw, (max-width: 1024px) 40vw, 300px"
                    />
                    
                    {/* Subtle border glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-blue/30 via-transparent to-accent-purple/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              </div>

              {/* Geometric Shapes - Decorative elements */}
              <div className="absolute top-8 right-8 w-20 h-20 md:w-32 md:h-32 border-2 border-accent-blue/20 rounded-2xl rotate-12 pointer-events-none" />
              <div className="absolute bottom-8 left-8 w-16 h-16 md:w-24 md:h-24 border-2 border-accent-purple/20 rounded-full pointer-events-none" />
              <div className="absolute top-1/3 right-1/4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-accent-neon/15 to-accent-blue/15 rounded-lg rotate-45 pointer-events-none" />
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Projects", value: "10+" },
            { label: "Certificate", value: "15+" },
            { label: "Technologies Used", value: "15+" },
            { label: "Coding Hours", value: "100+" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card text-center p-8 rounded-2xl glass shadow-soft hover:shadow-glow transition-all duration-300 cursor-default"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                <span className="stat-number text-white">{stat.value}</span>
              </div>
              <div className="text-white font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
