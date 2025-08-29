import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'

// Plugin to copy files to build directory
const copyFiles = () => ({
  name: 'copy-files',
  closeBundle() {
    // Ensure build directory exists
    mkdirSync('build', { recursive: true })
    // Copy manifest.json
    copyFileSync('src/manifest.json', 'build/manifest.json')
    // Copy popup.html to root of build directory if it exists in src subdirectory
    try {
      copyFileSync('build/src/popup.html', 'build/popup.html')
    } catch (error) {
      console.log('popup.html already in correct location')
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyFiles()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  publicDir: false
})
