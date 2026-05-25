/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A0F1C",
          50: "#131B2E",
          100: "#1A2438",
          200: "#243044",
        },
        surface: {
          DEFAULT: "#111827",
          raised: "#151D2E",
          border: "#1E293B",
        },
        accent: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
          muted: "#1D4ED8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["2rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "3rem", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "inset 0 1px 0 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.24)",
        "card-hover":
          "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.32)",
        glow: "0 0 0 3px rgba(59,130,246,0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.45s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
