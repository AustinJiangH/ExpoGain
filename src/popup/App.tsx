import { useState } from 'react'
import { requestCurveInjection } from './injectCurve'
import { captureAndSaveScreenshot } from './screenshot'
import type { Status } from './status'

/**
 * The popup view.
 *
 * Holds only display state; the two actions live in their own modules and
 * report back through the setters passed to them.
 */
export function App() {
  const [isInjected, setIsInjected] = useState(false)
  const [status, setStatus] = useState<Status>('Ready')
  const [error, setError] = useState('')

  const handleInjectCurve = () =>
    requestCurveInjection({ setStatus, setError, setInjected: setIsInjected })

  const handleTakeScreenshot = () => captureAndSaveScreenshot({ setStatus, setError })

  // Substring tests, deliberately: both actions report progress as prose, and
  // a screenshot in flight also reads as "injecting" because its status ends
  // in an ellipsis. That is long-standing behaviour — see the note in status.ts
  const isInjecting = status.includes('...')
  const isCapturing = status.includes('screenshot') || status.includes('Capturing')

  return (
    <div className="w-80 bg-twilight px-5 py-5">
      {/* Title lockup — left aligned, tagline in place of the old body copy */}
      <header>
        <h1 className="text-xl font-bold tracking-tight text-eggshell">Expo Gain Curve</h1>
        <p className="mt-1 text-[11px] text-eggshell/65">Interactive curve overlays</p>
      </header>

      <div className="mt-3.5 h-px bg-eggshell/20" />

      {/* Error display */}
      {error && (
        <div className="mt-4 rounded-lg border border-burnt-peach/45 bg-burnt-peach/15 p-2.5">
          <div className="text-[10px] font-medium uppercase tracking-wide text-apricot">Error</div>
          <div className="mt-1 text-xs leading-snug text-eggshell">{error}</div>
        </div>
      )}

      {/* Primary action — the one thing this popup is for */}
      <button
        onClick={handleInjectCurve}
        disabled={isInjected || status === 'Starting...' || status === 'Finding active tab...'}
        className={`group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition-all duration-200 ${
          isInjected
            ? 'cursor-not-allowed bg-muted-teal text-twilight shadow-lg shadow-twilight/40'
            : isInjecting
            ? 'cursor-not-allowed bg-eggshell/20 text-eggshell'
            : 'bg-burnt-peach text-eggshell shadow-lg shadow-twilight/50 hover:shadow-xl hover:brightness-105 active:scale-[0.98]'
        }`}
      >
        {isInjected ? '✓ Injected!' :
         isInjecting ? status :
         <>
           Inject Curve
           <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
         </>}
      </button>

      {/* Secondary action — present, but plainly not the main event */}
      <button
        onClick={handleTakeScreenshot}
        disabled={status === 'Taking screenshot...' || status === 'Capturing visible tab...'}
        className={`mt-3 w-full py-1.5 text-center text-xs transition-colors duration-200 ${
          isCapturing
            ? 'cursor-not-allowed text-apricot'
            : 'text-eggshell/70 underline-offset-4 hover:text-eggshell hover:underline'
        }`}
      >
        {isCapturing ? status : 'Take Screenshot'}
      </button>

      {/* Status — demoted to a quiet footer line */}
      <div className="mt-4 flex items-center gap-1.5 border-t border-eggshell/15 pt-3">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          status === 'Ready' ? 'bg-muted-teal' :
          status === 'Failed' || status === 'Error' ? 'bg-burnt-peach' :
          'bg-apricot'
        }`} />
        <span className={`text-[10px] tracking-wide ${
          status === 'Ready' ? 'text-muted-teal' :
          status === 'Failed' || status === 'Error' ? 'text-burnt-peach' :
          'text-apricot'
        }`}>
          {status}
        </span>
      </div>
    </div>
  )
}

export default App
