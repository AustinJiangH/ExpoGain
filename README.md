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
├── src/                   # Source code directory
├── build/                 # Built extension files (generated)
├── node_modules/          # Dependencies (generated)
├── package.json           # Dependencies and scripts
├── package-lock.json      # Lock file for exact dependency versions
├── webpack.config.js      # Webpack build configuration
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── postcss.config.js      # PostCSS configuration
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

### 🚀 Release Management

Use the provided Makefile commands for streamlined release management:

```bash
# Quick release commands (recommended)
make patch-release    # Create patch version (1.0.0 → 1.0.1)
make minor-release    # Create minor version (1.0.0 → 1.1.0)
make major-release    # Create major version (1.0.0 → 2.0.0)

# Manual release workflow
make build                     # Build the extension
make tag version=1.2.3        # Create and push git tag
make create-release version=1.2.3  # Create GitHub release (requires GitHub CLI)

# Other useful commands
make clean                    # Clean build directory
make push-release             # Push branch and tags to origin
make help                     # Show all available commands
```

#### Release Process:
1. **Automatic**: Use `make patch-release`, `make minor-release`, or `make major-release`
2. **Manual**: Build → Tag → Push → Create Release
3. **GitHub Release**: Automatically creates release with build artifacts (requires [GitHub CLI](https://cli.github.com/))

The release commands will prompt for confirmation and show version changes before proceeding.

### 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Webpack** - Module bundler and build tool
- **TailwindCSS** - Utility-first CSS framework
- **Chrome Extension Manifest V3** - Latest extension format
