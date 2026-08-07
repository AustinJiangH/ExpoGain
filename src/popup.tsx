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



  return (
    <div className="w-80 h-72 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="text-center w-full">
        <h1 className="text-2xl font-bold text-white mb-4">ExpoGain</h1>
        <p className="text-white/90 text-sm mb-4">
          Inject an interactive exponential curve visualization into any webpage
        </p>
        
        {/* Status display */}
        <div className="mb-4">
          <div className="text-white/80 text-xs mb-1">Status:</div>
          <div className={`text-sm font-medium ${
            status === 'Ready' ? 'text-green-200' :
            status === 'Failed' || status === 'Error' ? 'text-red-200' :
            'text-yellow-200'
          }`}>
            {status}
          </div>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mb-4 p-2 bg-red-500/20 rounded border border-red-300/30">
            <div className="text-red-200 text-xs">Error:</div>
            <div className="text-red-100 text-xs">{error}</div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleInjectCurve}
            disabled={isInjected || status === 'Starting...' || status === 'Finding active tab...' || status === 'Injecting script...'}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 w-full ${
              isInjected
                ? 'bg-green-500 text-white cursor-not-allowed'
                : status.includes('...')
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 active:scale-95'
            }`}
          >
            {isInjected ? '✓ Injected!' :
             status.includes('...') ? status :
             'Inject Curve'}
          </button>

          <button
            onClick={handleTakeScreenshot}
            disabled={status === 'Taking screenshot...' || status === 'Capturing visible tab...'}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 w-full border-2 ${
              status === 'Screenshot saved!'
                ? 'bg-green-500 text-white border-green-500 cursor-not-allowed'
                : status.includes('screenshot') || status.includes('Capturing')
                ? 'bg-yellow-500 text-white border-yellow-500 cursor-not-allowed'
                : 'bg-transparent text-white border-white hover:bg-white hover:text-blue-600 hover:scale-105 active:scale-95'
            }`}
          >
            {status === 'Screenshot saved!' ? '✓ Screenshot Saved!' :
             status.includes('screenshot') || status.includes('Capturing') ? status :
             '📸 Take Screenshot'}
          </button>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
