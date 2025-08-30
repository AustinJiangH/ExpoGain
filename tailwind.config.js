/** @type {import('tailwindcss').Config} */
export default {
  // Content paths tell Tailwind where to look for class names
  // This includes all JS, TS, JSX, and TSX files in the src directory
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // Theme configuration - extend adds custom values to Tailwind's defaults
  theme: {
    extend: {
      // Add custom theme extensions here if needed
      // colors: {}, spacing: {}, etc.
    },
  },

  // Plugins extend Tailwind's functionality
  // Common plugins: @tailwindcss/forms, @tailwindcss/typography, etc.
  plugins: [],
}
