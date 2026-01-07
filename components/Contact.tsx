"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { socialLinks } from "@/lib/constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Animated Input Component
function AnimatedInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  rows,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  const InputComponent = rows ? "textarea" : "input";

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-3"
        animate={{
          color: isFocused ? "var(--accent-purple)" : "var(--foreground)",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
          y: isFocused ? -2 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <InputComponent
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-5 py-4 rounded-xl glass border border-white/10 text-foreground placeholder-foreground-muted focus:outline-none transition-all duration-300 resize-none"
          style={{
            borderColor: isFocused
              ? "rgba(168, 85, 247, 0.5)"
              : "rgba(255, 255, 255, 0.1)",
            boxShadow: isFocused
              ? "0 0 20px rgba(168, 85, 247, 0.2)"
              : "none",
          }}
        />
        {/* Focus indicator line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </div>
  );
}

// Ripple Button Component
function RippleButton({
  children,
  disabled,
  className,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <motion.button
      ref={buttonRef}
      type="submit"
      disabled={disabled}
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
            animate={{
              width: 300,
              height: 300,
              x: ripple.x - 150,
              y: ripple.y - 150,
              opacity: [0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-0"
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.3 }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate form with stagger
      if (formRef.current) {
        const inputs = formRef.current.querySelectorAll(".form-input");
        gsap.fromTo(
          inputs,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate social icons
      if (socialRef.current) {
        const icons = socialRef.current.querySelectorAll(".social-icon");
        gsap.fromTo(
          icons,
          {
            opacity: 0,
            scale: 0.8,
            x: -20,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: socialRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
      // Use toast notification instead of alert for better UX
      const message = "Thank you for your message! I'll get back to you soon.";
      console.log(message);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="Contact section"
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
            Get In Touch
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon mx-auto rounded-full mb-6" />
          <p className="text-lg text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Social Links */}
          <motion.div
            ref={socialRef}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <h3 className="text-heading-1 font-semibold text-foreground mb-6">
                Let's Connect
              </h3>
              <p className="text-foreground-muted mb-8 leading-relaxed">
                Feel free to reach out if you're looking for a developer, have a
                question, or just want to connect.
              </p>
            </motion.div>

            <div className="space-y-4">
              {Object.entries(socialLinks).map(([platform, url], index) => (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon flex items-center gap-4 p-5 rounded-2xl glass shadow-soft border border-white/10 group relative overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    x: 10,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }}
                >
                  {/* Hover background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />

                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple flex items-center justify-center text-white font-semibold shadow-glow relative z-10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {platform.charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="text-foreground-muted group-hover:text-foreground transition-colors capitalize font-medium relative z-10">
                    {platform}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            ref={formRef}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-6 p-8 rounded-3xl glass shadow-soft"
          >
            <div className="form-input">
              <AnimatedInput
                id="name"
                name="name"
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="form-input">
              <AnimatedInput
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="youremail@example.com"
                required
              />
            </div>
            <div className="form-input">
              <AnimatedInput
                id="message"
                name="message"
                label="Message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your Project"
                required
                rows={6}
              />
            </div>
            <div className="form-input pt-2">
              <RippleButton
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-white font-semibold shadow-glow hover:shadow-glow-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </RippleButton>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
