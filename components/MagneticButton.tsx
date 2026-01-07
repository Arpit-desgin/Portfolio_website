"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: MagneticButtonProps) {
  const { ref, x, y, handlers } = useMagnetic({ strength: 0.25, enabled: !disabled });

  const baseClasses = {
    primary:
      "px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-white font-semibold shadow-glow hover:shadow-glow-hover transition-all duration-300",
    secondary:
      "px-8 py-4 glass rounded-xl text-foreground font-semibold border border-white/10 hover:border-accent-purple/50 hover:bg-white/5 transition-all duration-300",
    ghost:
      "px-6 py-3 text-foreground-muted hover:text-foreground transition-colors duration-300",
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref as any}
      href={href}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...handlers}
      style={{ x, y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} relative overflow-hidden group`}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent-neon to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      )}
    </Component>
  );
}

