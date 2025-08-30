const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      popup: './src/popup.tsx',
      content: './src/content.ts'
    },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer')
                ]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    // Generate popup.html
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    
    // Extract CSS
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    
    // Copy manifest and other files
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json'
        }
      ]
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        // For popup, create vendor chunk
        popupVendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: (chunk) => chunk.name === 'popup',
          enforce: true
        },
        // Completely disable vendor chunks for content script
        default: false,
        vendor: false
      }
    }
  }
  };
};
