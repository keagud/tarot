/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tarot-orange': {
          DEFAULT: '#d27852',
          100: '#2e160c',
          200: '#5c2c18',
          300: '#8b4324',
          400: '#b95930',
          500: '#d27852',
          600: '#db9374',
          700: '#e4ae96',
          800: '#edc9b9',
          900: '#f6e4dc'
        }, 'tarot-red': {
          DEFAULT: '#bb4a3d',
          100: '#260f0c',
          200: '#4b1e18',
          300: '#712c25',
          400: '#973b31',
          500: '#bb4a3d',
          600: '#cc6d62',
          700: '#d99189',
          800: '#e6b6b0',
          900: '#f2dad8'
        }, 'tarot-lightblue': {
          DEFAULT: '#95bfd4',
          100: '#152933',
          200: '#2a5367',
          300: '#3f7c9a',
          400: '#63a0bf',
          500: '#95bfd4',
          600: '#abccdd',
          700: '#c0d9e5',
          800: '#d5e6ee',
          900: '#eaf2f6'
        }, 'tarot-green': {
          DEFAULT: '#6c7c59',
          100: '#161912',
          200: '#2c3224',
          300: '#414b36',
          400: '#576348',
          500: '#6c7c59',
          600: '#8b9c76',
          700: '#a8b498',
          800: '#c5cdba',
          900: '#e2e6dd'
        }, 'tarot-yellow': {
          DEFAULT: '#fada5e',
          100: '#423502',
          200: '#856b04',
          300: '#c7a006',
          400: '#f8cb19',
          500: '#fada5e',
          600: '#fbe27c',
          700: '#fce99d',
          800: '#fdf0be',
          900: '#fef8de'
        }, 'tarot-black': {
          DEFAULT: '#343434',
          100: '#0a0a0a',
          200: '#141414',
          300: '#1f1f1f',
          400: '#292929',
          500: '#343434',
          600: '#5c5c5c',
          700: '#858585',
          800: '#adadad',
          900: '#d6d6d6'
        }, 'tarot-slate': {
          DEFAULT: '#333f47',
          100: '#0a0d0e',
          200: '#15191c',
          300: '#1f262b',
          400: '#293339',
          500: '#333f47',
          600: '#546774',
          700: '#788e9d',
          800: '#a5b4be',
          900: '#d2d9de'
        }, 'tarot-darkgray': {
          DEFAULT: '#777371',
          100: '#181716',
          200: '#2f2d2d',
          300: '#474443',
          400: '#5f5b59',
          500: '#777371',
          600: '#928e8b',
          700: '#adaaa8',
          800: '#c9c6c5',
          900: '#e4e3e2'
        }, 'tarot-medgray': {
          DEFAULT: '#a39a97',
          100: '#221f1e',
          200: '#433d3b',
          300: '#655c59',
          400: '#867b77',
          500: '#a39a97',
          600: '#b6afad',
          700: '#c8c3c1',
          800: '#dbd7d6',
          900: '#edebea'
        }, 'tarot-lightgray': {
          DEFAULT: '#e0dddb',
          100: '#2f2c29',
          200: '#5f5753',
          300: '#8e837d',
          400: '#b7b0ac',
          500: '#e0dddb',
          600: '#e6e4e3',
          700: '#edebea',
          800: '#f3f2f1',
          900: '#f9f8f8'
        }, 'tarot-white': {
          DEFAULT: '#fefffe',
          100: '#006600',
          200: '#00cc00',
          300: '#33ff33',
          400: '#99ff99',
          500: '#fefffe',
          600: '#ffffff',
          700: '#ffffff',
          800: '#ffffff',
          900: '#ffffff'
        }
      }
    },
  },

  corePlugins: { aspectRatio: false },
  plugins: [require('@tailwindcss/aspect-ratio')],
}

