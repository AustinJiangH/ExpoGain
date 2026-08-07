import { useEffect, useRef } from 'react'
import { alpha, palette } from '../palette'
import type { Frame } from './useDragResize'
import { useDragResize } from './useDragResize'
import { drawChart, prepareCanvas } from './paint'
import {
  BORDER_WIDTH,
  RESIZE_HANDLES,
  RESIZE_HANDLE_GLYPH,
  RESIZE_HANDLE_STYLE,
} from './handles'

interface ExponentialChartProps {
  onClose: () => void
}

/** Opens at 60% of the viewport, capped so it stays manageable on wide screens */
const createInitialFrame = (): Frame => ({
  position: { x: 100, y: 100 },
  size: {
    width: Math.min(window.innerWidth * 0.6, 800),
    height: Math.min(window.innerHeight * 0.6, 600),
  },
})

/**
 * The floating chart panel injected into a host page.
 *
 * Styled inline throughout: the extension injects no stylesheet into the page
 * it lands on, and class names would collide with the site's own CSS.
 */
export function ExponentialChart({ onClose }: ExponentialChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { position, size, startDrag, startResize } = useDragResize(createInitialFrame)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = prepareCanvas(canvas, size)
    if (!ctx) return

    drawChart(ctx, size)
  }, [size])

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        border: `${BORDER_WIDTH}px solid ${palette.mutedTeal}`,
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // Barely-there wash of eggshell — enough to read as a panel, still
        // letting the page beneath show through
        backgroundColor: alpha(palette.eggshell, 0.15),
        zIndex: 10000,
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: palette.burntPeach,
          color: palette.eggshell,
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'brightness(1.08)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'none'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        ✕
      </button>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          pointerEvents: 'none', // Allow mouse events to pass through
        }}
      />

      {/* Drag area, inset from the rim so the handles stay reachable */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          cursor: 'move',
          zIndex: 1, // Ensure it's above the canvas
        }}
        onMouseDown={startDrag}
      />

      {/* Resize handles — corners and edges, centred on the border box.
          aria-hidden keeps them out of the accessibility tree since they are
          pointer-only affordances; the title is a hint for sighted users. */}
      {RESIZE_HANDLES.map(({ direction, cursor, shift, angle, ...offsets }) => (
        <div
          key={direction}
          aria-hidden
          title={`Resize ${direction}`}
          style={{
            ...RESIZE_HANDLE_STYLE,
            ...offsets,
            cursor,
            transform: `${shift} rotate(${angle}deg)`,
          }}
          onMouseDown={(e) => startResize(e, direction)}
        >
          {RESIZE_HANDLE_GLYPH}
        </div>
      ))}
    </div>
  )
}

export default ExponentialChart
