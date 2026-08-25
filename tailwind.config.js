/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E8500A',
          'orange-light': '#F26522',
          'orange-dark': '#C94208',
          'orange-pale': '#FFF3ED',
          'orange-muted': '#FDDCC8',
          green: '#2D5016',
          'green-light': '#3A6B1E',
          'green-pale': '#F0F5EB',
          cream: '#FFF8F2',
          'cream-2': '#FFF3ED',
          sand: '#F5EDE0',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'dot-bounce': 'dotBounce 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.14)',
        orange: '0 4px 14px rgba(232,80,10,0.35)',
        green: '0 4px 14px rgba(45,80,22,0.25)',
        soft: '0 2px 20px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
