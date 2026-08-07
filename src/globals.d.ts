// Ambient declarations for things webpack loaders and the content script add.
// This file is a global script — deliberately no imports or exports, so both
// declarations below merge into the global scope.

// Without this, TypeScript cannot resolve side-effect imports like
// `import './index.css'` (TS2882) since CSS files ship no type declarations.
declare module '*.css'

interface Window {
  /** Installed by the content script for manual inspection in DevTools */
  expoGainDebug?: () => string
}
