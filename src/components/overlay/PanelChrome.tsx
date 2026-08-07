import React from 'react'
import * as overlay from '../../styles/overlay'

/**
 * The chrome of the injected panel — wordmark, hairline, close control and
 * resize studs. Styling comes from src/styles/overlay.ts, which composes the
 * tokens in src/styles/theme.ts; nothing here declares a literal of its own.
 *
 * These render into a host page, so they are styled inline rather than by
 * class: the extension injects no stylesheet into the page, and class names
 * would collide with the site's own CSS.
 */

interface PanelMarkProps {
  name: string
  sub: string
}

/**
 * Wordmark and eyebrow. Decorative only — pointerEvents is none, so the drag
 * surface beneath keeps receiving the mousedown it always did.
 */
export const PanelMark: React.FC<PanelMarkProps> = ({ name, sub }) => (
  <>
    <div style={overlay.mark}>
      <span style={overlay.wordmark}>{name}</span>
      <span style={overlay.wordmarkSub}>{sub}</span>
    </div>
    <div style={overlay.hairline} />
  </>
)

interface PanelCloseButtonProps {
  onClose: () => void
}

/** A graphite disc rimmed in silver; brightens on hover */
export const PanelCloseButton: React.FC<PanelCloseButtonProps> = ({ onClose }) => (
  <button
    onClick={onClose}
    aria-label="Close"
    style={overlay.closeButton}
    onMouseEnter={(e) => {
      Object.assign(e.currentTarget.style, overlay.closeButtonHover.hover)
    }}
    onMouseLeave={(e) => {
      Object.assign(e.currentTarget.style, overlay.closeButtonHover.rest)
    }}
  >
    ✕
  </button>
)

interface PanelResizeHandleProps {
  /** Placement and cursor for this stud, from overlay.resizeHandles */
  style: React.CSSProperties
  onMouseDown: (e: React.MouseEvent) => void
}

/** A silver stud set into the rim, dragged to resize */
export const PanelResizeHandle: React.FC<PanelResizeHandleProps> = ({ style, onMouseDown }) => (
  <div style={{ ...overlay.stud, ...style }} onMouseDown={onMouseDown} />
)

interface PanelDragSurfaceProps {
  onMouseDown: (e: React.MouseEvent) => void
}

/** The invisible surface that moves the panel, inset so the studs stay clear */
export const PanelDragSurface: React.FC<PanelDragSurfaceProps> = ({ onMouseDown }) => (
  <div style={overlay.dragSurface} onMouseDown={onMouseDown} />
)
