/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      colors: {
        brand: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
        },
      },
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease infinite',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
