import type { CSSProperties } from 'react'
import { face, ground, lining, plot, radius, rule, shadow, silver, tint, type } from './theme'

/**
 * Styles for the injected overlay, composed entirely from the tokens in
 * theme.ts. ExponentialChart imports these; it does not write style literals.
 *
 * Everything here is presentation only — no rule changes an element's hit
 * area, stacking order or pointer behaviour relative to the original layout.
 */

/** The panel itself. Position and size stay with the component, which owns them. */
export const panel: CSSProperties = {
  borderRadius: radius.panel,
  border: `1px solid ${lining.rim}`,
  background: face.card,
  boxShadow: [shadow.panel, shadow.contain, lining.inset].join(', '),
}

/** The plot surface, laid over the panel face and transparent to the mouse */
export const canvas: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: radius.panelInner,
  pointerEvents: 'none',
}

/** Wordmark block — decorative, so it never intercepts the drag area beneath */
export const mark: CSSProperties = {
  position: 'absolute',
  top: 14,
  left: 18,
  display: 'flex',
  alignItems: 'baseline',
  gap: '10px',
  pointerEvents: 'none',
  zIndex: 2,
}

export const wordmark: CSSProperties = {
  fontFamily: type.display,
  fontSize: '15px',
  letterSpacing: '0.05em',
  color: silver.s200,
}

export const wordmarkSub: CSSProperties = {
  fontFamily: type.sans,
  fontSize: '8px',
  letterSpacing: type.trackingEngraved,
  textTransform: 'uppercase',
  color: silver.s500,
}

/** Hairline beneath the wordmark, stopping short of the close button */
export const hairline: CSSProperties = {
  position: 'absolute',
  top: 40,
  left: 18,
  right: 58,
  height: '1px',
  background: rule.hairline,
  pointerEvents: 'none',
  zIndex: 2,
}

export const closeButton: CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '32px',
  height: '32px',
  border: 'none',
  borderRadius: '50%',
  backgroundColor: tint.raise,
  color: silver.s300,
  fontSize: '12px',
  fontWeight: 400,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10001,
  transition: 'all 0.2s ease',
  boxShadow: shadow.control,
}

/** Hover face for the close button, applied imperatively on mouse enter/leave */
export const closeButtonHover = {
  rest: { backgroundColor: tint.raise, color: silver.s300 },
  hover: { backgroundColor: 'rgba(255, 255, 255, 0.12)', color: silver.s100 },
} as const

/** Resize handles: small silver studs set into the rim */
export const stud: CSSProperties = {
  position: 'absolute',
  background: face.stud,
  boxShadow: shadow.stud,
}

/**
 * Where each stud sits and which way it drags. Placement and hit area are
 * unchanged from the original layout — corners are 12px discs at -6, edges
 * are 20x8 pills at -4 — so resizing behaves exactly as before.
 */
export const resizeHandles = [
  { direction: 'nw', style: { top: -6, left: -6, width: 12, height: 12, borderRadius: '50%', cursor: 'nw-resize' } },
  { direction: 'ne', style: { top: -6, right: -6, width: 12, height: 12, borderRadius: '50%', cursor: 'ne-resize' } },
  { direction: 'sw', style: { bottom: -6, left: -6, width: 12, height: 12, borderRadius: '50%', cursor: 'sw-resize' } },
  { direction: 'se', style: { bottom: -6, right: -6, width: 12, height: 12, borderRadius: '50%', cursor: 'se-resize' } },
  { direction: 'n', style: { top: -4, left: '50%', transform: 'translateX(-50%)', width: 20, height: 8, borderRadius: '4px', cursor: 'n-resize' } },
  { direction: 's', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 20, height: 8, borderRadius: '4px', cursor: 's-resize' } },
  { direction: 'w', style: { left: -4, top: '50%', transform: 'translateY(-50%)', width: 8, height: 20, borderRadius: '4px', cursor: 'w-resize' } },
  { direction: 'e', style: { right: -4, top: '50%', transform: 'translateY(-50%)', width: 8, height: 20, borderRadius: '4px', cursor: 'e-resize' } },
] as const satisfies ReadonlyArray<{ direction: string; style: CSSProperties }>

/** The drag surface, inset from the rim so the studs stay reachable */
export const dragSurface: CSSProperties = {
  position: 'absolute',
  top: 20,
  left: 20,
  right: 20,
  bottom: 20,
  cursor: 'move',
  zIndex: 1,
}

/** Canvas palette, re-exported so the drawing code has one import */
export const plotPalette = plot

/** Kept for callers that need the raw grounds, e.g. future theming */
export const grounds = ground
