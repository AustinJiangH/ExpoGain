/**
 * Pure geometry for the exponential chart: the plotted viewport, the data →
 * canvas projection, curve sampling, axis ticks, and the drag/resize maths.
 *
 * Nothing here touches the DOM, a canvas or React, so every function is
 * deterministic and directly testable.
 */

export interface Size {
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

/** The eight directions a panel edge or corner can be dragged */
export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

/** The slice of the plane the panel shows */
export const VIEWPORT = { xMin: -2.5, xMax: 2.5, yMin: -2, yMax: 6 } as const

/** y = e^(ax) + b, drawn as a polyline of `samples` + 1 points */
export const CURVE = { a: 1, b: 0, samples: 200 } as const

/** A panel never resizes below this in either axis */
export const MIN_PANEL_SIZE = 200

/** Where the pointer was when a resize began, and the panel's geometry then */
export interface ResizeOrigin {
  x: number
  y: number
  width: number
  height: number
  posX: number
  posY: number
}

/** Projectors from data space into canvas space for a given panel size */
export function createTransforms(size: Size): {
  transformX: (x: number) => number
  transformY: (y: number) => number
} {
  const { xMin, xMax, yMin, yMax } = VIEWPORT
  return {
    transformX: (x: number) => ((x - xMin) * size.width) / (xMax - xMin),
    transformY: (y: number) => size.height - ((y - yMin) * size.height) / (yMax - yMin),
  }
}

/** The curve as canvas-space points, ready to be stroked as a polyline */
export function sampleCurve(size: Size): Point[] {
  const { xMin, xMax } = VIEWPORT
  const { a, b, samples } = CURVE
  const { transformX, transformY } = createTransforms(size)

  const points: Point[] = []
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (i * (xMax - xMin)) / samples
    const y = Math.exp(a * x) + b
    points.push({ x: transformX(x), y: transformY(y) })
  }
  return points
}

/**
 * Tick positions across an axis, stepping by one from the minimum.
 *
 * The x axis starts at -2.5, so its ticks are the half integers -2.5, -1.5 …
 * 2.5 rather than whole numbers. That is deliberate — those exact values are
 * the rendered labels — so this steps from `min` rather than rounding to it.
 */
export function axisTicks(min: number, max: number): number[] {
  const ticks: number[] = []
  for (let value = min; value <= max; value++) {
    ticks.push(value)
  }
  return ticks
}

/** A drag moves the panel by the pointer delta from where it was grabbed */
export function applyDrag(pointer: Point, grabOffset: Point): Point {
  return { x: pointer.x - grabOffset.x, y: pointer.y - grabOffset.y }
}

/**
 * One resize step: the panel's new position and size for a pointer location.
 *
 * Dragging a north or west edge both shrinks the panel and moves it, so the
 * position correction is computed from the *clamped* width or height. That is
 * what pins the far edge in place once the minimum size is reached.
 */
export function applyResize(
  origin: ResizeOrigin,
  pointer: Point,
  direction: ResizeDirection,
  minSize: number = MIN_PANEL_SIZE,
): { position: Point; size: Size } {
  const deltaX = pointer.x - origin.x
  const deltaY = pointer.y - origin.y

  let width = origin.width
  let height = origin.height
  let x = origin.posX
  let y = origin.posY

  if (direction.includes('e')) {
    width = Math.max(minSize, origin.width + deltaX)
  }
  if (direction.includes('w')) {
    width = Math.max(minSize, origin.width - deltaX)
    x = origin.posX + (origin.width - width)
  }
  if (direction.includes('s')) {
    height = Math.max(minSize, origin.height + deltaY)
  }
  if (direction.includes('n')) {
    height = Math.max(minSize, origin.height - deltaY)
    y = origin.posY + (origin.height - height)
  }

  return { position: { x, y }, size: { width, height } }
}
