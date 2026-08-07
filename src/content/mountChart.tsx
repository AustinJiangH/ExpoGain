import { createRoot } from 'react-dom/client'
import ExponentialChart from '../chart/ExponentialChart'

const CONTAINER_CLASS = 'expogain-chart-container'

/**
 * Mounts the chart into the host page, replacing any chart already there.
 *
 * Known issue, left as-is because fixing it changes runtime behaviour: the
 * existing container is removed from the DOM without unmounting its React
 * root, so re-injecting leaks the previous root and its document-level drag
 * listeners. Worth a separate pass.
 */
export function injectExponentialCurve(): void {
  console.log('🔧 ExpoGain: Starting React curve creation...')

  // Check if curve already exists to prevent duplicates
  const existingCurve = document.querySelector(`.${CONTAINER_CLASS}`)
  if (existingCurve) {
    console.log('🗑️ ExpoGain: Removing existing curve...')
    existingCurve.remove()
  }

  const container = document.createElement('div')
  container.className = CONTAINER_CLASS

  console.log('📄 ExpoGain: Adding curve container to document body...')
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(
    <ExponentialChart
      onClose={() => {
        console.log('🗑️ ExpoGain: Closing curve...')
        root.unmount()
        container.remove()
      }}
    />,
  )

  console.log('✅ ExpoGain: React curve component rendered!')
  console.log('🎉 ExpoGain: Curve injection process completed!')
}
