/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          page: '#0A0B10',
          card: '#12141C',
          elevated: '#1A1D2E',
          highlight: '#1E2235'
        },
        border: {
          default: '#252840',
          subtle: '#1E2035'
        },
        purple: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          xlight: '#EDE9FE'
        },
        green: {
          DEFAULT: '#22C55E',
          light: '#4ADE80'
        },
        red: {
          DEFAULT: '#EF4444',
          light: '#F87171'
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D'
        },
        teal: {
          DEFAULT: '#14B8A6',
          light: '#2DD4BF'
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#475569'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
