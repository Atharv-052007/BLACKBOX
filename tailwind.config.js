/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#090A0C',
          900: '#0C0D10',
          850: '#101216',
          800: '#15171B',
          750: '#1A1D22',
          700: '#21252B',
          600: '#2B3038',
        },
        bone: '#F2F0EA',
        ash: '#858991',
        blood: '#B83232',
        brass: '#C69A55',
        steel: '#7C93A8',
        line: 'rgba(255,255,255,0.09)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        label: '0.22em',
        wide: '0.14em',
        ultrawide: '0.34em',
      },
      boxShadow: {
        panel: '0 24px 60px -32px rgba(0,0,0,0.9)',
        lift: '0 18px 40px -20px rgba(0,0,0,0.85)',
        glow: '0 0 0 1px rgba(184,50,50,0.35), 0 0 40px -8px rgba(184,50,50,0.35)',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(0.82)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-8px,0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        dash: {
          to: { strokeDashoffset: '-1000' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
        scan: 'scan 8s linear infinite',
        drift: 'drift 7s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        blink: 'blink 1.1s step-end infinite',
        dash: 'dash 22s linear infinite',
      },
    },
  },
  plugins: [],
}
