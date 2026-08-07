/**
 * The design tokens of tokens.css, mirrored for JavaScript.
 *
 * The injected overlay renders into an arbitrary host page, so it cannot rely
 * on our stylesheet — a page's own CSS would collide with our class names, and
 * the extension does not inject a stylesheet into the host document. Its
 * styling therefore has to be inline, which means the tokens must exist in TS.
 *
 * This is the only sanctioned duplication of a token value in the project.
 * When a value changes in tokens.css it must change here too, and nowhere else
 * should a colour, gradient or shadow literal appear.
 */

/** Grounds: near-black through graphite */
export const ground = {
  obsidian900: '#08080a',
  obsidian850: '#0c0d0f',
  obsidian800: '#0d0e10',
  obsidian700: '#17181c',
  graphite600: '#1e1f23',
  graphite500: '#2a2b31',
  graphite400: '#3a3c43',
  graphite300: '#43454c',
} as const

/** The silver ramp: lining, brushed metal, engraved type */
export const silver = {
  s050: '#ffffff',
  s075: '#f7f8f9',
  s100: '#f2f3f5',
  s150: '#e9ebee',
  s200: '#dfe1e6',
  s250: '#d3d7dd',
  s300: '#c2c6cd',
  s350: '#b3b7be',
  s400: '#9296a0',
  s450: '#83868e',
  s500: '#7e818a',
  s600: '#5e616a',
} as const

/** Accents, used sparingly */
export const accent = {
  champagne: '#c9b072',
  oxblood: '#c08a86',
} as const

/** White at fixed strengths — the only way light is added */
export const tint = {
  veil: 'rgba(255, 255, 255, 0.02)',
  raise: 'rgba(255, 255, 255, 0.05)',
  hairline: 'rgba(255, 255, 255, 0.07)',
  rim: 'rgba(255, 255, 255, 0.15)',
  rimStrong: 'rgba(255, 255, 255, 0.35)',
  highlight: 'rgba(255, 255, 255, 0.22)',
} as const

/** Faces: the metal and the card stock */
export const face = {
  card: `linear-gradient(160deg, ${ground.graphite600} 0%, ${ground.obsidian850} 48%, ${ground.obsidian700} 100%)`,
  stud: `linear-gradient(180deg, ${silver.s150} 0%, ${silver.s350} 52%, ${silver.s450} 100%)`,
} as const

/** The lining seen edge-on: a hairline rim plus the highlight it catches */
export const lining = {
  rim: 'rgba(211, 215, 221, 0.34)',
  inset: ['inset 0 1px 0 rgba(255, 255, 255, 0.2)', `inset 0 -1px 0 ${tint.raise}`].join(', '),
} as const

/** Elevation */
export const shadow = {
  panel: '0 30px 60px -20px rgba(0, 0, 0, 0.8)',
  contain: '0 0 0 1px rgba(0, 0, 0, 0.55)',
  stud: 'inset 0 0 0 1px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.6)',
  control:
    'inset 0 0 0 1px rgba(212, 216, 222, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
} as const

/** Rules: hairlines that fade the way engraving does */
export const rule = {
  hairline: `linear-gradient(90deg, ${tint.highlight}, ${tint.raise} 65%, transparent)`,
} as const

/** Type */
export const type = {
  display: '"Didot", "Bodoni MT", "Hoefler Text", "Baskerville", Garamond, Georgia, serif',
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  trackingEngraved: '0.32em',
} as const

/** Geometry */
export const radius = {
  panel: '16px',
  panelInner: '15px',
} as const

/** The palette the curve itself is drawn in, on canvas */
export const plot = {
  axis: 'rgba(210, 214, 220, 0.4)',
  grid: 'rgba(255, 255, 255, 0.07)',
  label: 'rgba(194, 198, 205, 0.75)',
  labelFont: `11px ${type.display}`,
  /** Brushed silver running into champagne as the curve climbs */
  curveStops: [silver.s400, silver.s200, accent.champagne] as const,
  curveBloom: 'rgba(223, 225, 230, 0.35)',
} as const
