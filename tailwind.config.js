/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand - emerald-teal gradient family
        brand: {
          50:  '#edfcf4',
          100: '#d3f8e5',
          200: '#aaf0ce',
          300: '#72e3b4',
          400: '#37ce95',
          500: '#14b47c',
          600: '#099265',
          700: '#077452',
          800: '#085c43',
          900: '#084c38',
          950: '#032b20',
        },
        // Accent - sky blue
        accent: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Warning/danger
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
        // Surface tokens (dark mode first)
        surface: {
          primary:   'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          tertiary:  'var(--surface-tertiary)',
          border:    'var(--surface-border)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #14b47c 0%, #0ea5e9 100%)',
        'hero-gradient':  'linear-gradient(135deg, #032b20 0%, #082f49 50%, #032b20 100%)',
        'card-gradient':  'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'glow-brand':     'radial-gradient(circle at center, rgba(20,180,124,0.15) 0%, transparent 70%)',
      },
      animation: {
        'spin-slow':      'spin 8s linear infinite',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':          'float 6s ease-in-out infinite',
        'glow':           'glow 2s ease-in-out infinite alternate',
        'shimmer':        'shimmer 1.5s infinite',
        'fade-in':        'fadeIn 0.5s ease-out',
        'slide-up':       'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(20,180,124,0.3)' },
          to:   { boxShadow: '0 0 40px rgba(20,180,124,0.6), 0 0 80px rgba(20,180,124,0.2)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'brand':    '0 4px 24px rgba(20,180,124,0.25)',
        'brand-lg': '0 8px 48px rgba(20,180,124,0.35)',
        'glass':    '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':     '0 2px 16px rgba(0,0,0,0.2)',
        'card-lg':  '0 8px 40px rgba(0,0,0,0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
