import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121820",
        bgaccent: "#121820",
        foreground: "var(--foreground)",
        accent: "#00D9D9",
      },
    },
  },
  plugins: [],
} satisfies Config;
