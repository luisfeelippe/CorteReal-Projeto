/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: '#0B1120', 
          card: '#1E293B',
          primary: '#06B6D4',
          secondary: '#6366F1',
        }
      },
    },
    plugins: [],
  }