/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      ringWidth: {
        DEFAULT: '1px',
      },
      ringColor: {
        DEFAULT: 'transparent',
      },
      borderColor: {
        DEFAULT: 'transparent',
      },
      colors: {
        'teal': {
          50: '#E2F5F6',
          100: '#C5EAED',
          200: '#8BD5DB',
          300: '#51C0C9',
          400: '#40A6AF', // Original Color
          500: '#36858C',
          600: '#2B6469',
          700: '#204246',
          800: '#142123',
          900: '#0A1011',
        },
        'olive-green': {
          50: '#F2F4E2',
          100: '#E5E9C6',
          200: '#CCD392',
          300: '#B2BD5D',
          400: '#99A728',
          500: '#7A8620',
          600: '#5C6418',
          700: '#3D4310',
          800: '#1F2108',
          900: '#0F1004',
        },
        'reddish-orange': {
          50: '#FDEDEA',
          100: '#FBDAD6',
          200: '#F7B5AD',
          300: '#F39085',
          400: '#EF6B5C',
          500: '#BF5950', // Original Color
          600: '#8F433C',
          700: '#5F2D28',
          800: '#301614',
          900: '#180B0A',
        },
        'green-teal': {
          50: '#E2F6F0',
          100: '#C5EDE1',
          200: '#8BEBC3',
          300: '#51E0A5',
          400: '#41AF81', // Original Color
          500: '#368F69',
          600: '#2B6F51',
          700: '#204038',
          800: '#142020',
          900: '#0A1010',
        },
        'blue-violet': {
          50: '#EDE6F5',
          100: '#DBCEEA',
          200: '#B796D5',
          300: '#926DBF',
          400: '#6F41AF', // Original Color
          500: '#59358C',
          600: '#432969',
          700: '#2C1C46',
          800: '#160E23',
          900: '#0B0711',
        },
        'magenta': {
          50: '#F5E6F2',
          100: '#EACDEA',
          200: '#D596D4',
          300: '#BF6DBE',
          400: '#AF41A5', // Original Color
          500: '#8C3584',
          600: '#692963',
          700: '#461C42',
          800: '#231021',
          900: '#110811',
        },
        'deep-purple': {
          50: '#F0E5F2',
          100: '#E0CAE5',
          200: '#C199CB',
          300: '#A368B0',
          400: '#854795',
          500: '#5F2565', // Original Color
          600: '#4C1E52',
          700: '#39163E',
          800: '#270F2B',
          900: '#140715',
        },
        'dark-purple': {
          50: '#F3E8F4',
          100: '#E6D0E9',
          200: '#CCA1D4',
          300: '#B273BF',
          400: '#9954AA',
          500: '#83338A', // Original Color
          600: '#66296C',
          700: '#4A1F4E',
          800: '#2D1430',
          900: '#170A18',
        },
        'light-purple': {
          50: '#F9F0FA',
          100: '#F4E0F5',
          200: '#E9C1EB',
          300: '#DDA3E1',
          400: '#D285D7',
          500: '#BB5FC4', // Original Color
          600: '#964C9D',
          700: '#713876',
          800: '#4B254E',
          900: '#261227',
        },
        'soft-lavender': {
          50: '#FBF3FA',
          100: '#F7E7F5',
          200: '#EFCFEA',
          300: '#E7B8E0',
          400: '#DFA1D5',
          500: '#CB84D2', // Original Color
          600: '#A26AAA',
          700: '#7A4F82',
          800: '#513559',
          900: '#291A2D',
        },
        'salmon': {
          50: '#FEF6F7',
          100: '#FCECEE',
          200: '#F8D8DC',
          300: '#F3C5C9',
          400: '#EEB1B7',
          500: '#EDAFB8', // Original Color
          600: '#D29AA2',
          700: '#B6858C',
          800: '#9B7076',
          900: '#7F5B60',
        },
        'light-desert': {
          50: '#FFFBFA',
          100: '#FFF7F5',
          200: '#FEEFEA',
          300: '#FDE7DF',
          400: '#FBDFD4',
          500: '#F7E1D7', // Original Color
          600: '#DCC9BF',
          700: '#C0B1A7',
          800: '#A5998F',
          900: '#897177',
        },
        'light-forest': {
          50: '#F9F9F7',
          100: '#F3F3EF',
          200: '#E7E6DF',
          300: '#DBD9CF',
          400: '#CFCCC0',
          500: '#DEDBD2', // Original Color
          600: '#C3C0B9',
          700: '#A8A5A0',
          800: '#8D8A87',
          900: '#726F6E',
        },
        'army-green': {
          50: '#F4F7F5',
          100: '#E8EFEA',
          200: '#D1DFD4',
          300: '#BACFBE',
          400: '#A3BFA8',
          500: '#B0C4B1', // Original Color
          600: '#9AAD9B',
          700: '#849685',
          800: '#6E7F6F',
          900: '#586859',
        },
        'dark-green': {
          50: '#F1F2F2',
          100: '#E3E5E5',
          200: '#C7CACB',
          300: '#ACB0B1',
          400: '#909597',
          500: '#4A5759', // Original Color
          600: '#424E4F',
          700: '#3A4546',
          800: '#323C3D',
          900: '#2A3334',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  mode: 'jit',
}

