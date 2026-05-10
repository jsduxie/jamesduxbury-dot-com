import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A14',
        surface: '#16161F',
        border: '#2A2A35',
        text: '#F5F5F0',
        muted: '#8B8B95',
        accent: '#3B82F6',
        'accent-deep': '#1E40AF',
        danger: '#DC2626',
        live: '#22C55E',
        dev: '#EAB308',

        // legacy aliases — kept so unmigrated components keep building
        background: '#0A0A14',
        bgaccent: '#16161F',
        foreground: '#F5F5F0',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle at 1px 1px, rgba(245, 245, 240, 0.06) 1px, transparent 0)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
