/** @type {import('tailwindcss').Config} */
/**
 * Fortitier Logistics design system.
 * Industrial trust: gold primary, bronze secondary, deep brown dark bands.
 * No teal. No Gileara Velocity.
 */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#DFA040",
          light: "#FBCF6A",
          soft: "#F8E8C8",
        },
        bronze: {
          DEFAULT: "#AC7023",
          deep: "#8A5A1C",
        },
        brown: {
          DEFAULT: "#3B1902",
          muted: "#5C3A22",
          soft: "#7A5A40",
        },
        ink: "#000000",
        paper: {
          DEFAULT: "#FFFFFF",
          warm: "#FBF7F2",
          sand: "#F3EBE0",
        },
        primary: "rgb(var(--primary) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        "on-background": "rgb(var(--on-background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
        "surface-variant": "rgb(var(--surface-variant) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
        "surface-container": "rgb(var(--surface-container) / <alpha-value>)",
        "surface-container-low": "rgb(var(--surface-container-low) / <alpha-value>)",
        "surface-container-high": "rgb(var(--surface-container-high) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        "on-error": "rgb(var(--on-error) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        wide: ["var(--font-archivo)", "var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.4rem, 4.5vw + 1rem, 4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 3.5vw + 0.85rem, 3.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "clamp(1.6rem, 2.5vw + 0.75rem, 2.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em" },
        ],
        "heading-lg": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "heading-md": ["1.375rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        label: ["0.75rem", { lineHeight: "1.4" }],
        "label-lg": ["0.8125rem", { lineHeight: "1.4" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        "section-tight": "var(--space-section-tight)",
        section: "var(--space-section)",
        "section-loose": "var(--space-section-loose)",
      },
      maxWidth: {
        container: "72rem",
        measure: "65ch",
      },
      borderRadius: {
        none: "0",
        xs: "2px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      backgroundImage: {
        "gold-swoosh":
          "linear-gradient(135deg, #FBCF6A 0%, #DFA040 45%, #AC7023 100%)",
        "brown-band":
          "linear-gradient(180deg, #3B1902 0%, #1A0B01 100%)",
        "warm-paper":
          "linear-gradient(180deg, #FFFFFF 0%, #FBF7F2 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgb(59 25 2 / 0.06), 0 8px 24px rgb(59 25 2 / 0.06)",
        "card-hover":
          "0 2px 4px rgb(59 25 2 / 0.08), 0 12px 32px rgb(59 25 2 / 0.1)",
        cta: "0 8px 20px rgb(172 112 35 / 0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
