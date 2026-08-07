/**
 * The project palette, mirrored for JavaScript.
 *
 * The popup uses the Tailwind tokens declared in src/index.css. The injected
 * chart cannot: it renders into an arbitrary host page with no stylesheet of
 * ours, and its curve is drawn on a canvas, so both need real values here.
 *
 * Keep these in step with the @theme block in src/index.css.
 */
export const palette = {
  /** Delicate neutral, chalky cream — the panel ground */
  eggshell: '#f4f1de',
  /** Fiery and robust — the primary action and the curve itself */
  burntPeach: '#e07a5f',
  /** Twilight’s serene depth — the popup ground, axes and type */
  twilight: '#3d405b',
  /** Cool blue fused with earthy green — frames, handles, all-clear states */
  mutedTeal: '#81b29a',
  /** Creamy warmth — work in progress */
  apricot: '#f2cc8f',
} as const

/** Palette colour at partial alpha, for grid lines and tinted panels */
export const alpha = (hex: string, fraction: number): string =>
  `${hex}${Math.round(fraction * 255).toString(16).padStart(2, '0')}`
