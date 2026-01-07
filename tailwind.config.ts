import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-charcoal": "var(--background-charcoal)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        "accent-blue": "var(--accent-blue)",
        "accent-purple": "var(--accent-purple)",
        "accent-neon": "var(--accent-neon)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-1": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "display-2": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.2", fontWeight: "700" }],
        "display-3": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-1": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-2": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-3": ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        "soft": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow": "0 0 20px rgba(0, 212, 255, 0.1), 0 0 40px rgba(168, 85, 247, 0.1)",
        "glow-hover": "0 0 30px rgba(0, 212, 255, 0.2), 0 0 60px rgba(168, 85, 247, 0.2)",
        "inner-glow": "inset 0 0 20px rgba(0, 212, 255, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionTimingFunction: {
        "out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
export default config;

