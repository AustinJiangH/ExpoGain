import React, { useRef, useEffect, useState } from 'react'
import { alpha, palette } from '../palette'

interface ExponentialChartProps {
  onClose: () => void
}

// The container's border sits outside the padding box that absolutely
// positioned children are laid out against, so every handle offset has to
// compensate for it. Without this the whole set drifts inward by 2px.
const BORDER_WIDTH = 2

// Each handle pins the sides it belongs to at the border box, then pulls
// itself back by half its own size — so it lands centred on its corner or
// edge midpoint whatever the handle or border measures. The arrow is one
// glyph rotated onto each axis, which keeps every direction rendering the
// same way across fonts.
const RESIZE_HANDLES = [
  { direction: 'nw', cursor: 'nw-resize', top: -BORDER_WIDTH, left: -BORDER_WIDTH, shift: 'translate(-50%, -50%)', angle: 45 },
  { direction: 'n', cursor: 'n-resize', top: -BORDER_WIDTH, left: '50%', shift: 'translate(-50%, -50%)', angle: 90 },
  { direction: 'ne', cursor: 'ne-resize', top: -BORDER_WIDTH, right: -BORDER_WIDTH, shift: 'translate(50%, -50%)', angle: -45 },
  { direction: 'e', cursor: 'e-resize', top: '50%', right: -BORDER_WIDTH, shift: 'translate(50%, -50%)', angle: 0 },
  { direction: 'se', cursor: 'se-resize', bottom: -BORDER_WIDTH, right: -BORDER_WIDTH, shift: 'translate(50%, 50%)', angle: 45 },
  { direction: 's', cursor: 's-resize', bottom: -BORDER_WIDTH, left: '50%', shift: 'translate(-50%, 50%)', angle: 90 },
  { direction: 'sw', cursor: 'sw-resize', bottom: -BORDER_WIDTH, left: -BORDER_WIDTH, shift: 'translate(-50%, 50%)', angle: -45 },
  { direction: 'w', cursor: 'w-resize', top: '50%', left: -BORDER_WIDTH, shift: 'translate(-50%, -50%)', angle: 0 },
] as const

const RESIZE_HANDLE_STYLE: React.CSSProperties = {
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

export const ExponentialChart: React.FC<ExponentialChartProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState('')
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ 
    width: Math.min(window.innerWidth * 0.6, 800), // 60vw with max 800px
    height: Math.min(window.innerHeight * 0.6, 600) // 60vh with max 600px
  })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })

  // Draw the exponential curve
  const drawCurve = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get device pixel ratio for high-DPI displays
    const dpr = window.devicePixelRatio || 1
    const displayWidth = size.width
    const displayHeight = size.height

    // Set canvas dimensions accounting for device pixel ratio
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr

    // Scale the canvas back down using CSS
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    // Scale the drawing context so everything is drawn at the correct size
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, displayWidth, displayHeight)

    // Set up coordinate system
    const xMin = -2.5
    const xMax = 2.5
    const yMin = -2
    const yMax = 6

    // Parameters for y = e^(ax) + b
    const a = 1 // Growth rate
    const b = 0 // Y-intercept shift

    // Transform functions
    const transformX = (x: number) => ((x - xMin) * displayWidth) / (xMax - xMin)
    const transformY = (y: number) => displayHeight - ((y - yMin) * displayHeight) / (yMax - yMin)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = palette.twilight
    ctx.lineWidth = 1

    // X-axis
    const yAxisY = transformY(0)
    ctx.moveTo(0, yAxisY)
    ctx.lineTo(displayWidth, yAxisY)

    // Y-axis
    const xAxisX = transformX(0)
    ctx.moveTo(xAxisX, 0)
    ctx.lineTo(xAxisX, displayHeight)
    ctx.stroke()

    // Draw exponential curve
    ctx.beginPath()
    ctx.strokeStyle = palette.burntPeach
    ctx.lineWidth = 2

    // Draw curve with more points for smoothness
    const points = 200
    for (let i = 0; i <= points; i++) {
      const x = xMin + (i * (xMax - xMin)) / points
      const y = Math.exp(a * x) + b
      const canvasX = transformX(x)
      const canvasY = transformY(y)

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = alpha(palette.twilight, 0.25)
    ctx.lineWidth = 0.5
    ctx.setLineDash([2, 2])

    // Vertical grid lines
    for (let x = xMin; x <= xMax; x++) {
      if (x !== 0) {
        const canvasX = transformX(x)
        ctx.beginPath()
        ctx.moveTo(canvasX, 0)
        ctx.lineTo(canvasX, displayHeight)
        ctx.stroke()
      }
    }

    // Horizontal grid lines
    for (let y = yMin; y <= yMax; y++) {
      if (y !== 0) {
        const canvasY = transformY(y)
        ctx.beginPath()
        ctx.moveTo(0, canvasY)
        ctx.lineTo(displayWidth, canvasY)
        ctx.stroke()
      }
    }
    ctx.setLineDash([])

    // Add numbers to axes
    ctx.fillStyle = palette.twilight
    ctx.font = '10px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // X-axis numbers
    for (let x = xMin; x <= xMax; x++) {
      if (x !== 0) {
        const canvasX = transformX(x)
        ctx.fillText(x.toString(), canvasX, yAxisY + 5)
      }
    }

    // Y-axis numbers
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let y = yMin; y <= yMax; y++) {
      if (y !== 0) {
        const canvasY = transformY(y)
        ctx.fillText(y.toString(), xAxisX - 5, canvasY)
      }
    }
  }

  // Redraw when size changes
  useEffect(() => {
    drawCurve()
  }, [size])

  // Initial draw
  useEffect(() => {
    drawCurve()
  }, [])

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | string) => {
    e.preventDefault()
    e.stopPropagation()

    if (action === 'drag') {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    } else if (action.startsWith('resize-')) {
      setIsResizing(true)
      setResizeDirection(action.replace('resize-', ''))
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      let newX = resizeStart.posX
      let newY = resizeStart.posY

      // Handle different resize directions
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(200, resizeStart.width + deltaX)
      }
      if (resizeDirection.includes('w')) {
        newWidth = Math.max(200, resizeStart.width - deltaX)
        newX = resizeStart.posX + (resizeStart.width - newWidth)
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(200, resizeStart.height + deltaY)
      }
      if (resizeDirection.includes('n')) {
        newHeight = Math.max(200, resizeStart.height - deltaY)
        newY = resizeStart.posY + (resizeStart.height - newHeight)
      }

      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection('')
  }

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart])

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
          e.currentTarget.style.filter = 'brightness(1.08)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'none';
          e.currentTarget.style.transform = 'scale(1)';
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

      {/* Drag area */}
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
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      />

      {/* Resize handles — corners and edges, centred on the border box */}
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
          onMouseDown={(e) => handleMouseDown(e, `resize-${direction}`)}
        >
          ↔
        </div>
      ))}
    </div>
  )
}

export default ExponentialChart
