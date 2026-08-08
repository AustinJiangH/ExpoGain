# Expo Gain Curve

A Chrome extension that injects a draggable, resizable exponential curve overlay into any webpage. **Inject Curve** drops the chart on the page; **Take Screenshot** captures the tab to your clipboard and downloads.

React 19 · TypeScript 7 · Webpack 5 (esbuild-loader) · TailwindCSS 4 · Manifest V3

## Quick Start

```bash
npm install
npm run build      # type-checks, then bundles to build/
npm run dev        # watch mode (no type checking — run typecheck alongside)
npm run typecheck  # tsc --noEmit
npm run clean
```

Load it: `chrome://extensions/` → enable **Developer mode** → **Load unpacked** → select `build/`. After a rebuild, hit reload on the extension card.

## Structure

```
src/
├── popup.tsx        # entry
├── content.ts       # entry
├── palette.ts       # palette for JS/canvas consumers
├── messages.ts      # popup ↔ content wire format
├── index.css        # Tailwind + @theme palette tokens
├── popup/           # App view, injectCurve, screenshot, download, status
├── chart/           # panel, useDragResize, geometry, paint, handles
└── content/         # bootstrap, mountChart
```

Tailwind v4 needs no `tailwind.config.js` — the theme lives in `@theme` in `index.css`.

## Palette

| Colour | Hex | Used for |
| --- | --- | --- |
| Twilight Indigo | `#3d405b` | Popup ground; chart axes, labels, grid |
| Eggshell | `#f4f1de` | Popup type; panel wash; handle fill |
| Burnt Peach | `#e07a5f` | Primary action; close button; faults |
| Muted Teal | `#81b29a` | Chart frame and handles; ready/success |
| Apricot Cream | `#f2cc8f` | Work in progress |
| Curve Blue | `#3f72b8` | The plotted curve |

Defined twice on purpose: `index.css` as Tailwind tokens for the popup, `palette.ts` as values for the injected chart, which has no stylesheet and draws on a canvas. Change one, change the other.

## Releases

```bash
make patch-release   # 0.3.0 → 0.3.1
make minor-release   # 0.3.0 → 0.4.0
make major-release   # 0.3.0 → 1.0.0

make tag version=0.4.0             # tag and push
make create-release version=0.4.0  # GitHub release (needs gh)
make help                          # all commands
```

The version lives in **both** `package.json` and `src/manifest.json` and must match. The Makefile reads `package.json` but updates neither — bump them yourself before tagging. Chrome rejects a Web Store upload versioned below the published one.

## Debugging

The content script logs on every matched page; `expoGainDebug()` is available from its context in DevTools.
