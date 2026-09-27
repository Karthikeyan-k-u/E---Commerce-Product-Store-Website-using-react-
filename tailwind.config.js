/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--color-bg)',
          elevated: 'var(--color-bg-elevated)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          glass: 'var(--color-surface-glass)',
          border: 'var(--color-border)',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Deep Indigo
          700: '#4338ca', // Indigo Dark
          800: '#3730a3',
          900: '#312e81',
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
        },
        accent: {
          DEFAULT: '#7c3aed', // Electric Violet
          violet: '#7c3aed',
          indigo: '#4f46e5',
          cyan: '#06b6d4',
          sky: '#38bdf8',
          amber: '#f59e0b',
          rose: '#f43f5e',
          emerald: '#10b981',
        },
        cta: {
          DEFAULT: '#10b981', // Emerald Buy/Checkout
          hover: '#059669',
          light: '#34d399',
          dark: '#047857',
        },
        sale: {
          DEFAULT: '#f43f5e', // Rose Sale/Discount
          hover: '#e11d48',
          light: '#fb7185',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(99, 102, 241, 0.3)',
        'glow': '0 0 25px -4px rgba(99, 102, 241, 0.45)',
        'glow-lg': '0 0 45px -6px rgba(139, 92, 246, 0.5)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.4)',
        'float': '0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 10px 15px -5px rgba(0, 0, 0, 0.3)',
        'float-lg': '0 30px 65px -15px rgba(0, 0, 0, 0.65), 0 0 30px -8px rgba(99, 102, 241, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'pro-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'pro-card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(99, 102, 241, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
