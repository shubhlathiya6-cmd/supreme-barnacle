import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        icomoon: ['"icomoon"', "sans-serif"],
      },
      colors: {
        bn: {
          bg: "#ffffff",
          ink: "#0a0a0a",
          muted: "#6b7280",
          line: "#e5e7eb",
          cream: "#faf9f7",
          gold: "#b08d57",
          link: "#0a0a0a",
          success: "#0a7a3b",
        },
      },
      borderColor: {
        DEFAULT: "#e5e7eb",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 8px 24px rgba(15, 23, 42, 0.08)",
        modal: "0 16px 48px rgba(15, 23, 42, 0.12)",
        ring: "0 0 0 2px #0a0a0a",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translate(-50%, 12px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-image": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out forwards",
        "fade-up": "fade-up 300ms cubic-bezier(0.2, 0, 0, 1) forwards",
        "toast-in": "toast-in 220ms cubic-bezier(0.2, 0, 0, 1) forwards",
        "slide-down": "slide-down 220ms ease-out forwards",
        "fade-in-image": "fade-in-image 400ms ease-out forwards",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
