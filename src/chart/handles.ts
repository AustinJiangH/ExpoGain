import type React from 'react'
import { palette } from '../palette'
import type { ResizeDirection } from './geometry'

/**
 * The panel's border width, shared between the container and the resize
 * handles. Absolutely positioned children lay out against the padding box,
 * but the border sits outside it, so every handle offset compensates by this
 * amount. Keeping it in one place is what stops the two drifting apart.
 */
export const BORDER_WIDTH = 2

export interface ResizeHandleSpec {
  direction: ResizeDirection
  cursor: string
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  /** Pulls the handle back by half itself, centring it on the border box */
  shift: string
  /** Rotation that points the arrow along this handle's axis of travel */
  angle: number
}

/**
 * Each handle pins the sides it belongs to at the border box, then shifts
 * back by half its own size — so it lands centred on its corner or edge
 * midpoint whatever the handle or the border measures.
 *
 * One arrow glyph is rotated onto each axis rather than using four different
 * glyphs, which keeps every direction rendering identically across fonts.
 */
export const RESIZE_HANDLES: readonly ResizeHandleSpec[] = [
  { direction: 'nw', cursor: 'nw-resize', top: -BORDER_WIDTH, left: -BORDER_WIDTH, shift: 'translate(-50%, -50%)', angle: 45 },
  { direction: 'n', cursor: 'n-resize', top: -BORDER_WIDTH, left: '50%', shift: 'translate(-50%, -50%)', angle: 90 },
  { direction: 'ne', cursor: 'ne-resize', top: -BORDER_WIDTH, right: -BORDER_WIDTH, shift: 'translate(50%, -50%)', angle: -45 },
  { direction: 'e', cursor: 'e-resize', top: '50%', right: -BORDER_WIDTH, shift: 'translate(50%, -50%)', angle: 0 },
  { direction: 'se', cursor: 'se-resize', bottom: -BORDER_WIDTH, right: -BORDER_WIDTH, shift: 'translate(50%, 50%)', angle: 45 },
  { direction: 's', cursor: 's-resize', bottom: -BORDER_WIDTH, left: '50%', shift: 'translate(-50%, 50%)', angle: 90 },
  { direction: 'sw', cursor: 'sw-resize', bottom: -BORDER_WIDTH, left: -BORDER_WIDTH, shift: 'translate(-50%, 50%)', angle: -45 },
  { direction: 'w', cursor: 'w-resize', top: '50%', left: -BORDER_WIDTH, shift: 'translate(-50%, -50%)', angle: 0 },
]

export const RESIZE_HANDLE_STYLE: React.CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: 20,
  height: 20,
  borderRadius: '50%',
  border: `2px solid ${palette.mutedTeal}`,
  backgroundColor: palette.eggshell,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.28)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  lineHeight: 1,
  color: palette.twilight,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  userSelect: 'none',
  zIndex: 2,
}

/** The glyph every handle carries, rotated per direction */
export const RESIZE_HANDLE_GLYPH = '↔'
