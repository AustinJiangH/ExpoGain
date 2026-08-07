import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  const [isInjected, setIsInjected] = useState(false)
  const [status, setStatus] = useState('Ready')
  const [error, setError] = useState('')

  const handleInjectCurve = async () => {
    setStatus('Starting...')
    setError('')

    try {
      setStatus('Finding active tab...')
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (!tab.id) {
        setError('No active tab found')
        setStatus('Error')
        return
      }

      if (!tab.url) {
        setError('Cannot access tab URL')
        setStatus('Error')
        return
      }

      // Check if current page is supported
      if (tab.url.startsWith('chrome://') ||
          tab.url.startsWith('chrome-extension://') ||
          tab.url.startsWith('edge://') ||
          tab.url.startsWith('about:') ||
          tab.url.startsWith('moz-extension://')) {
        setError('Cannot inject on browser internal pages. Please navigate to a regular website.')
        setStatus('Error')
        return
      }

      setStatus('Sending message to content script...')

      // Simply send message to content script - it will handle everything
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'injectCurve' })

      if (response && response.success) {
        setStatus('Injected!')
        setIsInjected(true)
        setTimeout(() => {
          setIsInjected(false)
          setStatus('Ready')
        }, 2000)
      } else {
        setError('Content script did not respond properly')
        setStatus('Failed')
      }

    } catch (error) {
      console.error('ExpoGain Error:', error)
      setError('Content script not found. Make sure you are on a regular website (not chrome:// pages) and try refreshing the page.')
      setStatus('Failed')
    }
  }

  const handleTakeScreenshot = async () => {
    setStatus('Taking screenshot...')
    setError('')

    let screenshotUrl: string | undefined

    try {
      setStatus('Capturing visible tab...')

      // Get current window ID
      const currentWindow = await chrome.windows.getCurrent()

      if (!currentWindow.id) {
        setError('Cannot access current window')
        setStatus('Error')
        return
      }

      // Take screenshot of visible tab
      screenshotUrl = await chrome.tabs.captureVisibleTab(currentWindow.id, {
        format: 'png',
        quality: 100
      })

      if (screenshotUrl) {
        setStatus('Screenshot captured!')

        // Create download link
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `expogain-screenshot-${timestamp}.png`

        // Convert data URL to blob for clipboard
        const response = await fetch(screenshotUrl)
        const blob = await response.blob()

        let clipboardSuccess = false

        // Copy to clipboard
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
          ])
          clipboardSuccess = true
          setStatus('Screenshot copied to clipboard!')
          console.log('Screenshot copied to clipboard successfully')
        } catch (clipboardError) {
          console.error('Clipboard copy failed:', clipboardError)
          setStatus('Screenshot captured (clipboard failed)')
        }

        // Download the screenshot (fallback method - always works)
        try {
          console.log('Using fallback download method (link-based)')

          // Create a temporary link element for download
          const link = document.createElement('a')
          link.href = screenshotUrl
          link.download = filename
          link.style.display = 'none'

          // Add to DOM temporarily
          document.body.appendChild(link)

          // Trigger download
          link.click()

          // Clean up
          document.body.removeChild(link)

          console.log('Fallback download triggered for:', filename)

          if (clipboardSuccess) {
            setStatus('Screenshot downloaded & copied to clipboard!')
          } else {
            setStatus('Screenshot downloaded!')
          }
        } catch (downloadError) {
          console.error('Fallback download also failed:', downloadError)

          if (clipboardSuccess) {
            setStatus('Screenshot copied to clipboard!')
          } else {
            setError('Failed to save screenshot')
            setStatus('Failed')
          }
        }

        setTimeout(() => {
          setStatus('Ready')
        }, 3000)
      } else {
        setError('Failed to capture screenshot')
        setStatus('Failed')
      }

    } catch (error) {
      console.error('Screenshot Error:', error)

      // Try alternative download method if primary fails
      if (screenshotUrl) {
        try {
          console.log('Using final fallback download method')
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          const filename = `expogain-screenshot-${timestamp}.png`

          // Create a temporary link element for download
          const link = document.createElement('a')
          link.href = screenshotUrl
          link.download = filename
          link.style.display = 'none'

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          console.log('Final fallback download triggered')
          setStatus('Screenshot downloaded (fallback method)!')

          setTimeout(() => {
            setStatus('Ready')
          }, 3000)
        } catch (fallbackError) {
          console.error('All download methods failed:', fallbackError)
          setError('Screenshot captured but failed to download. Try copying manually.')
          setStatus('Screenshot captured')
        }
      } else {
        setError('Failed to capture screenshot. Please try again.')
        setStatus('Failed')
      }
    }
  }



  const isInjecting = status.includes('...')
  const isCapturing = status.includes('screenshot') || status.includes('Capturing')

  return (
    <div className="w-80 bg-twilight px-5 py-5">
      {/* Title lockup — left aligned, tagline in place of the old body copy */}
      <header>
        <h1 className="text-xl font-bold tracking-tight text-eggshell">ExpoGain</h1>
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
        disabled={isInjected || status === 'Starting...' || status === 'Finding active tab...' || status === 'Injecting script...'}
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
          status === 'Screenshot saved!'
            ? 'cursor-not-allowed text-muted-teal'
            : isCapturing
            ? 'cursor-not-allowed text-apricot'
            : 'text-eggshell/70 underline-offset-4 hover:text-eggshell hover:underline'
        }`}
      >
        {status === 'Screenshot saved!' ? '✓ Screenshot Saved!' :
         isCapturing ? status :
         'Take Screenshot'}
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
