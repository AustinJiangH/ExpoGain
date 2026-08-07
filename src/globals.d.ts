// Ambient module declarations for non-code assets handled by webpack loaders.
// Without this, TypeScript cannot resolve side-effect imports like
// `import './index.css'` (TS2882) since CSS files ship no type declarations.
declare module '*.css'
