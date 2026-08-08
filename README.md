# Expo Gain Curve

A Chrome extension that injects an interactive exponential curve overlay into any webpage. Built with React, TypeScript, Webpack and TailwindCSS.

Click the toolbar icon, hit **Inject Curve**, and a draggable, resizable chart panel appears on the page. **Take Screenshot** captures the visible tab, copies it to the clipboard and saves it to your downloads.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
# Build the extension once (type-checks first, then bundles)
npm run build

# Watch for changes and rebuild automatically
npm run dev

# Type-check without building
npm run typecheck

# Clean build directory
npm run clean
```

`npm run build` runs `tsc --noEmit` before webpack, so a type error fails the build. `npm run dev` skips that gate for speed — esbuild strips types without checking them — so run `npm run typecheck` alongside it if you want live type errors.

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
│   ├── popup.tsx          # Popup entry — mounts App
│   ├── content.ts         # Content script entry — bootstrap calls only
│   ├── palette.ts         # Palette values for JS/canvas consumers
│   ├── messages.ts        # Wire format between popup and content script
│   ├── index.css          # Tailwind import + @theme palette tokens
│   ├── globals.d.ts       # Ambient declarations (*.css, window.expoGainDebug)
│   ├── manifest.json      # Chrome MV3 manifest
│   ├── popup.html         # Popup HTML template
│   ├── popup/
│   │   ├── App.tsx        # Popup view
│   │   ├── injectCurve.ts # Tab lookup, scheme guard, message send
│   │   ├── screenshot.ts  # Capture → clipboard → download
│   │   ├── download.ts    # Anchor-click save + filename
│   │   └── status.ts      # Status union and reporting types
│   ├── chart/
│   │   ├── ExponentialChart.tsx  # The floating panel (presentational)
│   │   ├── useDragResize.ts      # Drag/resize gesture state machine
│   │   ├── geometry.ts           # Pure maths: transforms, sampling, resize
│   │   ├── paint.ts              # Canvas painting
│   │   └── handles.ts            # Resize handle table and styling
│   └── content/
│       ├── bootstrap.ts   # Startup logs, badge, debug hook, listener
│       └── mountChart.tsx # Mounts the chart into the host page
├── build/                 # Built extension files (generated)
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Webpack build configuration
├── tsconfig.json          # TypeScript configuration
├── postcss.config.js      # PostCSS configuration
└── Makefile               # Release management
```

Tailwind v4 needs no `tailwind.config.js` — it auto-detects sources, and the theme lives in `@theme` inside `src/index.css`.

### 🎨 Palette

Five colours, defined in two places that must stay in step:

| Colour | Hex | Used for |
| --- | --- | --- |
| Twilight Indigo | `#3d405b` | Popup ground; chart axes, labels and grid |
| Eggshell | `#f4f1de` | Popup type; chart panel wash; handle fill |
| Burnt Peach | `#e07a5f` | Primary action; close button; fault states |
| Muted Teal | `#81b29a` | Chart frame and handles; ready and success |
| Apricot Cream | `#f2cc8f` | Work in progress |

The plotted curve is blue (`#3f72b8`).

`src/index.css` declares them as Tailwind `@theme` tokens, so the popup writes `bg-twilight` and `text-eggshell` rather than hex. `src/palette.ts` mirrors them for the injected chart, which renders into a host page with no stylesheet of ours and draws on a canvas. Change one, change the other.

### 🛠️ Development Workflow

1. **Make changes** to files in the `src/` directory
2. **Watch mode**: Run `npm run dev` to automatically rebuild on changes
3. **Reload extension**: Go to `chrome://extensions/` and click the reload button on your extension
4. **Test**: Click the extension icon to see your changes

Debugging the content script: it logs its startup on every matched page, and `expoGainDebug()` is available from the extension's content-script context in DevTools.

### 📦 Build for Production

```bash
npm run build
```

This creates optimized files in the `build/` directory ready for Chrome Web Store submission.

### 🚀 Release Management

Use the provided Makefile commands for streamlined release management:

```bash
# Quick release commands (recommended)
make patch-release    # Create patch version (0.3.0 → 0.3.1)
make minor-release    # Create minor version (0.3.0 → 0.4.0)
make major-release    # Create major version (0.3.0 → 1.0.0)

# Manual release workflow
make build                         # Build the extension
make tag version=0.4.0             # Create and push git tag
make create-release version=0.4.0  # Create GitHub release (requires GitHub CLI)

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

The version lives in **two** files — `package.json` and `src/manifest.json` — and both must match. The Makefile reads the current version from `package.json`; it does not update either file, so bump them yourself before tagging. Chrome rejects a Web Store upload whose version is lower than the published one.

### 🎨 Tech Stack

- **React 19** — UI framework
- **TypeScript 7** — type safety, run as a separate gate via `tsc --noEmit`
- **Webpack 5** — module bundler, with **esbuild-loader** transpiling TS/TSX
- **TailwindCSS 4** — utility-first CSS, configured in CSS via `@theme`
- **Chrome Extension Manifest V3** — latest extension format
