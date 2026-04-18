import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3e2723',
        'primary-light': '#6a4f4b',
        'primary-lighter': '#8d6e63',
        'background-light': '#f7f7f6',
        'background-dark': '#1c1716',
        cream: '#fff8e1',
        'cream-dark': '#2d2422',
        'coffee-foam': '#efebe9',
        'amber-rich': '#d84315',
        gold: '#ffb300',
        sage: '#a3b899',
        brick: '#c66b6b',
        accent: '#d97706',
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        sm: '0.5rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(62, 39, 35, 0.08)',
        'card': '0 4px 16px rgba(62, 39, 35, 0.12)',
        'elevated': '0 8px 32px rgba(62, 39, 35, 0.16)',
        'gold': '0 4px 20px rgba(255, 179, 0, 0.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config
