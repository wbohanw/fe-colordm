/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'scanner': 'scanner 4s ease-in-out infinite',
      },
      keyframes: {
        scanner: {
          '0%': { transform: 'translateY(0%) scaleX(1.5)' },
          '50%': { transform: 'translateY(1200%) scaleX(1.5)' },
          '100%': { transform: 'translateY(0%) scaleX(1.5)' }
        }
      },
      boxShadow: {
        'cyber': '0 0 10px rgba(6, 182, 212, 0.3)',
        'cyber-lg': '0 0 15px rgba(6, 182, 212, 0.4)',
      },
      backgroundImage: {
        'cyber-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }
    },
  },
  plugins: [],
  corePlugins: {
    backgroundOpacity: true
  },
  safelist: [
    'bg-opacity-10',
    'bg-opacity-20',
    'bg-opacity-30',
    'bg-opacity-40',
    'bg-opacity-50',
    'bg-opacity-60',
    'bg-opacity-70',
    'bg-opacity-80',
    'bg-opacity-90',
  ]
} 