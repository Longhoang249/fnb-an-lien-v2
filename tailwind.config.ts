import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── V1 Brand Color Inheritance ──────────────────────────────
        // Primary — warm dark coffee
        primary: {
          DEFAULT: '#3e2723',
          light: '#6a4f4b',
          lighter: '#8d6e63',
        },
        // Background — warm neutrals
        background: {
          light: '#f7f7f6',
          dark: '#1c1716',
        },
        // Cream & foam — warm highlights
        cream: '#fff8e1',
        'cream-dark': '#2d2422',
        'coffee-foam': '#efebe9',
        // Accent palette from V1
        'amber-rich': '#d84315',
        gold: '#ffb300',
        sage: '#a3b899',
        brick: '#c66b6b',
        accent: '#d97706',
        // Surface tokens
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        'border-color': 'var(--border)',
        // ── Semantic tokens ─────────────────────────────────────────
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', ...fontFamily.sans],
        sans: ['"Inter"', ...fontFamily.sans],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(62, 39, 35, 0.15)',
        card: '0 4px 20px -5px rgba(62, 39, 35, 0.08)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
        paper:
          '0 4px 6px -1px rgba(62, 39, 35, 0.05), 0 2px 4px -1px rgba(62, 39, 35, 0.03)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { transform: 'translateY(10px)' }, to: { transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
