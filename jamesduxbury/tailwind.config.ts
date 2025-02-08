import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(17, 24, 39)",
        bgaccent: "#121820",
        foreground: "var(--foreground)",
        accent: "#3182ce",
      },
    },
  },
  plugins: [],
} satisfies Config;
