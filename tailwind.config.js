/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Warm horizon tones
        primary: {
          DEFAULT: '#D97038',
          light: '#E69663',
          dark: '#B85A2A',
        },
        // Secondary Colors - Sky and earth tones
        secondary: {
          DEFAULT: '#5B8FA3',
          light: '#7FAABB',
          dark: '#456B7A',
        },
        // Accent Colors - Community warmth
        accent: {
          DEFAULT: '#C85C5C',
          light: '#D98585',
          dark: '#A04646',
        },
        // Neutral Colors - Natural materials
        neutral: {
          100: '#F8F6F4',
          200: '#E8E4E0',
          300: '#D1CBC3',
          400: '#A39C94',
          500: '#73695E',
          600: '#4A433B',
          700: '#2D2821',
          800: '#1A1612',
        },
        // Semantic Colors
        success: '#5A9367',
        warning: '#D9A538',
        error: '#C85C5C',
        info: '#5B8FA3',
      },
      fontFamily: {
        body: ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        special: ['TT2020', 'Courier New', 'monospace'],
        mono: ['SF Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
      },
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(29, 38, 33, 0.05)',
        'sm': '0 1px 3px 0 rgba(29, 38, 33, 0.1), 0 1px 2px -1px rgba(29, 38, 33, 0.1)',
        'md': '0 4px 6px -1px rgba(29, 38, 33, 0.1), 0 2px 4px -2px rgba(29, 38, 33, 0.1)',
        'lg': '0 10px 15px -3px rgba(29, 38, 33, 0.1), 0 4px 6px -4px rgba(29, 38, 33, 0.1)',
        'xl': '0 20px 25px -5px rgba(29, 38, 33, 0.1), 0 8px 10px -6px rgba(29, 38, 33, 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        'base': 0,
        'dropdown': 1000,
        'sticky': 1100,
        'fixed': 1200,
        'modal-backdrop': 1300,
        'modal': 1400,
        'popover': 1500,
        'tooltip': 1600,
      },
    },
  },
  plugins: [],
}
