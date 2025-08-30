// Webpack configuration for Chrome Extension
// This config handles building popup and content scripts with React and TypeScript

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  // Determine if we're in production mode
  const isProduction = argv.mode === 'production';

  return {
    // Entry points for the extension
    // popup: Main popup interface (React component)
    // content: Content script that runs on web pages
    entry: {
      popup: './src/popup.tsx',
      content: './src/content.ts'
    },

    // Output configuration
    output: {
      path: path.resolve(__dirname, 'build'), // Build output directory
      filename: '[name].js', // Use entry point name for output files
      clean: true // Clean build directory before each build
    },
    // Module processing rules
    module: {
      rules: [
        {
          // Process TypeScript and TSX files
          test: /\.tsx?$/,
          use: 'ts-loader', // Use ts-loader to transpile TypeScript
          exclude: /node_modules/ // Exclude node_modules for performance
        },
        {
          // Process CSS files with Tailwind support
          test: /\.css$/,
          use: [
            // style-loader: Injects CSS into the DOM (good for popup)
            {
              loader: 'style-loader'
            },
            // css-loader: Resolves CSS imports and URLs
            'css-loader',
            // postcss-loader: Processes CSS with PostCSS plugins
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss'), // Process Tailwind CSS
                    require('autoprefixer') // Add vendor prefixes automatically
                  ]
                }
              }
            }
          ]
        }
      ]
    },

    // Module resolution configuration
    resolve: {
      // File extensions to resolve automatically
      extensions: ['.tsx', '.ts', '.js']
    },
    // Webpack plugins for Chrome Extension
    plugins: [
      // Generate popup.html from template
      new HtmlWebpackPlugin({
        template: './src/popup.html', // Source HTML template
        filename: 'popup.html', // Output filename
        chunks: ['popup'] // Only include popup chunk in this HTML file
      }),

      // Note: CSS is inlined using style-loader instead of extracted to separate files
      // This is optimal for Chrome extensions where we want minimal HTTP requests

      // Copy static files (manifest.json) to build directory
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/manifest.json', // Source manifest file
            to: 'manifest.json' // Destination in build directory
          }
        ]
      })
    ],

    // Code splitting and optimization configuration
    optimization: {
      // Control how chunks are split
      splitChunks: {
        chunks: 'async', // Only split async (dynamically imported) chunks
        cacheGroups: {
          // Disable default vendor chunking to keep extension simple
          default: false,
          vendors: false
        }
      }
    }
  };
};
