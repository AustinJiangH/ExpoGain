import { useEffect, useState } from 'react'
import type React from 'react'
import {
  applyDrag,
  applyResize,
  type Point,
  type ResizeDirection,
  type ResizeOrigin,
  type Size,
} from './geometry'

/** Where the panel is and how big it is */
export interface Frame {
  position: Point
  size: Size
}

/**
 * What the pointer is currently doing to the panel.
 *
 * Modelling this as one value rather than separate flags keeps the direction
 * and the grab origin inseparable from the gesture they belong to, so the
 * move handler can never read one gesture's direction with another's origin.
 */
type Interaction =
  | { kind: 'idle' }
  | { kind: 'drag'; grabOffset: Point }
  | { kind: 'resize'; direction: ResizeDirection; origin: ResizeOrigin }

export interface DragResize extends Frame {
  startDrag: (e: React.MouseEvent) => void
  startResize: (e: React.MouseEvent, direction: ResizeDirection) => void
}

/**
 * Drag-to-move and drag-to-resize for a floating panel.
 *
 * Listeners are bound to the document for the duration of a gesture only, so
 * the pointer can leave the panel mid-drag without losing it.
 */
export function useDragResize(createInitialFrame: () => Frame): DragResize {
  const [frame, setFrame] = useState<Frame>(createInitialFrame)
  const [interaction, setInteraction] = useState<Interaction>({ kind: 'idle' })

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInteraction({
      kind: 'drag',
      grabOffset: { x: e.clientX - frame.position.x, y: e.clientY - frame.position.y },
    })
  }

  const startResize = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault()
    e.stopPropagation()
    setInteraction({
      kind: 'resize',
      direction,
      origin: {
        x: e.clientX,
        y: e.clientY,
        width: frame.size.width,
        height: frame.size.height,
        posX: frame.position.x,
        posY: frame.position.y,
      },
    })
  }

  useEffect(() => {
    if (interaction.kind === 'idle') return

    const handleMouseMove = (e: MouseEvent) => {
      const pointer = { x: e.clientX, y: e.clientY }

      if (interaction.kind === 'drag') {
        setFrame((current) => ({
          ...current,
          position: applyDrag(pointer, interaction.grabOffset),
        }))
      } else {
        setFrame(applyResize(interaction.origin, pointer, interaction.direction))
      }
    }

    const handleMouseUp = () => setInteraction({ kind: 'idle' })

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [interaction])

  return { ...frame, startDrag, startResize }
}
