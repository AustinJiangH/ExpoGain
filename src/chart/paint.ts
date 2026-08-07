import { alpha, palette } from '../palette'
import { axisTicks, createTransforms, sampleCurve, VIEWPORT, type Size } from './geometry'

/**
 * Canvas painting for the exponential chart.
 *
 * Split in two so the sizing side effect stays separate from the drawing:
 * `prepareCanvas` mutates the element, `drawChart` only issues draw calls and
 * so can be exercised against a recording context.
 */

/**
 * Sizes the backing store for the device pixel ratio and returns a context
 * already scaled to CSS pixels.
 *
 * Assigning `canvas.width` resets both the bitmap and the transform, so this
 * is safe to call repeatedly — each call starts from a clean scale.
 */
export function prepareCanvas(
  canvas: HTMLCanvasElement,
  size: Size,
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const dpr = window.devicePixelRatio || 1

  canvas.width = size.width * dpr
  canvas.height = size.height * dpr
  canvas.style.width = `${size.width}px`
  canvas.style.height = `${size.height}px`

  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, size.width, size.height)

  return ctx
}

/**
 * Paints the chart into an already-scaled context.
 *
 * Order matters: the grid is laid over the curve rather than under it, which
 * is how the chart has always looked.
 */
export function drawChart(ctx: CanvasRenderingContext2D, size: Size): void {
  const { xMin, xMax, yMin, yMax } = VIEWPORT
  const { transformX, transformY } = createTransforms(size)

  const xAxisX = transformX(0)
  const yAxisY = transformY(0)
  const xTicks = axisTicks(xMin, xMax)
  const yTicks = axisTicks(yMin, yMax)

  drawAxes(ctx, size, xAxisX, yAxisY)
  drawCurve(ctx, size)
  drawGrid(ctx, size, xTicks, yTicks, transformX, transformY)
  drawTickLabels(ctx, xTicks, yTicks, transformX, transformY, xAxisX, yAxisY)
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  size: Size,
  xAxisX: number,
  yAxisY: number,
): void {
  ctx.beginPath()
  ctx.strokeStyle = palette.twilight
  ctx.lineWidth = 1

  ctx.moveTo(0, yAxisY)
  ctx.lineTo(size.width, yAxisY)

  ctx.moveTo(xAxisX, 0)
  ctx.lineTo(xAxisX, size.height)
  ctx.stroke()
}

function drawCurve(ctx: CanvasRenderingContext2D, size: Size): void {
  ctx.beginPath()
  ctx.strokeStyle = palette.curveBlue
  ctx.lineWidth = 2

  sampleCurve(size).forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.stroke()
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  size: Size,
  xTicks: number[],
  yTicks: number[],
  transformX: (x: number) => number,
  transformY: (y: number) => number,
): void {
  ctx.strokeStyle = alpha(palette.twilight, 0.25)
  ctx.lineWidth = 0.5
  ctx.setLineDash([2, 2])

  // Each line is stroked on its own path, which keeps the dash phase
  // restarting per line rather than running continuously through the set
  for (const x of xTicks) {
    if (x === 0) continue
    ctx.beginPath()
    ctx.moveTo(transformX(x), 0)
    ctx.lineTo(transformX(x), size.height)
    ctx.stroke()
  }

  for (const y of yTicks) {
    if (y === 0) continue
    ctx.beginPath()
    ctx.moveTo(0, transformY(y))
    ctx.lineTo(size.width, transformY(y))
    ctx.stroke()
  }

  ctx.setLineDash([])
}

function drawTickLabels(
  ctx: CanvasRenderingContext2D,
  xTicks: number[],
  yTicks: number[],
  transformX: (x: number) => number,
  transformY: (y: number) => number,
  xAxisX: number,
  yAxisY: number,
): void {
  ctx.fillStyle = palette.twilight
  ctx.font = '10px system-ui, -apple-system, sans-serif'

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (const x of xTicks) {
    if (x === 0) continue
    ctx.fillText(x.toString(), transformX(x), yAxisY + 5)
  }

  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (const y of yTicks) {
    if (y === 0) continue
    ctx.fillText(y.toString(), xAxisX - 5, transformY(y))
  }
}
