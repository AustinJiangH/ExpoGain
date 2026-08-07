// PostCSS configuration for processing CSS files
// PostCSS is used by webpack to transform CSS with plugins

module.exports = {
  plugins: {
    // Tailwind CSS v4 PostCSS plugin - processes @import "tailwindcss"
    // and generates utility classes. Vendor prefixing is handled internally
    // by Lightning CSS, so autoprefixer is no longer needed.
    '@tailwindcss/postcss': {},
  },
}
