/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      ringWidth: {
        DEFAULT: '1px',
      },
      ringColor: {
        DEFAULT: '#fff',
      },
      outlineColor: {
        DEFAULT: '#fff',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  mode: 'jit',
}

