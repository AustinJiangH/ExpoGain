# ExpoGain Chrome Extension

A modern Chrome extension built with React, TypeScript, Webpack, and TailwindCSS.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
# Build the extension once
npm run build

# Watch for changes and rebuild automatically
npm run dev

# Clean build directory
npm run clean
```

### 🔧 Loading Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `build` folder from this project
5. Your extension should now appear in Chrome!

### 📁 Project Structure

```
ExpoGain/
├── src/
│   ├── manifest.json      # Chrome extension manifest
│   ├── popup.html         # Popup HTML template
│   ├── popup.tsx          # React popup component
│   └── index.css          # TailwindCSS styles
├── build/                 # Built extension files (generated)
├── package.json           # Dependencies and scripts
└── webpack.config.js      # Webpack build configuration
```

### 🛠️ Development Workflow

1. **Make changes** to files in the `src/` directory
2. **Watch mode**: Run `npm run dev` to automatically rebuild on changes
3. **Reload extension**: Go to `chrome://extensions/` and click the reload button on your extension
4. **Test**: Click the extension icon to see your changes

### 📦 Build for Production

```bash
npm run build
```

This creates optimized files in the `build/` directory ready for Chrome Web Store submission.

### 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Webpack** - Module bundler and build tool
- **TailwindCSS** - Utility-first CSS framework
- **Chrome Extension Manifest V3** - Latest extension format
