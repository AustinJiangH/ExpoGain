// PostCSS configuration for processing CSS files
// PostCSS is used by webpack to transform CSS with plugins

export default {
  plugins: {
    // Tailwind CSS plugin - processes @tailwind directives and generates utility classes
    tailwindcss: {},

    // Autoprefixer plugin - automatically adds vendor prefixes to CSS properties
    // Ensures cross-browser compatibility for CSS features
    autoprefixer: {},
  },
}
