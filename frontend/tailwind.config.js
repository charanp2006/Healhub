/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* =====================
           BRAND / PRIMARY
        ====================== */
        primary: {
          DEFAULT: '#20C3AE',
          hover: '#179E8D',
          soft: '#A6E9E1',
          softDark: '#134E4A',
        },

        /* =====================
           BACKGROUNDS
        ====================== */
        background: {
          light: '#F3F4F6',
          dark: '#0F172A',
          cardLight: '#FFFFFF',
          cardDark: '#111827',
        },

        /* =====================
           TEXT
        ====================== */
        text: {
          primaryLight: '#1F2933',
          primaryDark: '#FFFFFF',
          secondaryLight: '#6B7280',
          secondaryDark: '#9CA3AF',
        },

        /* =====================
           ACCENTS
        ====================== */
        accent: {
          cta: '#FF6B6B',
          warning: '#F4D35E',
          linkLight: '#3A4F7A',
          linkDark: '#A6B4E0',
        },

        /* =====================
           BORDERS
        ====================== */
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
}
