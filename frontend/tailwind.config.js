/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#0B0F1A',
          card: '#151B28',
          card2: '#1B2230',
        },
        border: {
          subtle: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.14)',
        },
        text: {
          main: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },
        cyan: {
          DEFAULT: '#00E5FF',
          soft: 'rgba(0,229,255,0.12)',
        },
        green: {
          DEFAULT: '#4ADE80',
          bg: 'rgba(74,222,128,0.12)',
        },
        red: {
          DEFAULT: '#F87171',
          bg: 'rgba(248,113,113,0.12)',
        },
        yellow: {
          DEFAULT: '#FBBF24',
          bg: 'rgba(251,191,36,0.12)',
        },
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,229,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,229,255,0.6)' },
        },
      },
    },
  },
  plugins: [],
        }
