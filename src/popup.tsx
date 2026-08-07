import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Actions, Button, Card, Field, Mark, Notice, Rule, Text } from './components/ui'
import type { ButtonState, Tone } from './components/ui'
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



  // Presentation state, derived from the same conditions the controls have
  // always used — the tone and variant maps live with the components
  const statusTone: Tone =
    status === 'Ready' ? 'ready' :
    status === 'Failed' || status === 'Error' ? 'fault' :
    'working'

  const injectState: ButtonState =
    isInjected ? 'done' :
    status.includes('...') ? 'working' :
    'idle'

  const screenshotState: ButtonState =
    status === 'Screenshot saved!' ? 'done' :
    status.includes('screenshot') || status.includes('Capturing') ? 'working' :
    'idle'

  return (
    <Card>
      <Mark name="ExpoGain" sub="Exponential Visualization" />

      <Rule />

      <Text>Inject an interactive exponential curve visualization into any webpage</Text>

      {/* Status display */}
      <Field label="Status" value={status} tone={statusTone} />

      {/* Error display */}
      {error && <Notice label="Error">{error}</Notice>}

      {/* Action Buttons */}
      <Actions>
        <Button
          variant="primary"
          state={injectState}
          onClick={handleInjectCurve}
          disabled={isInjected || status === 'Starting...' || status === 'Finding active tab...' || status === 'Injecting script...'}
        >
          {isInjected ? '✓ Injected!' :
           status.includes('...') ? status :
           'Inject Curve'}
        </Button>

        <Button
          variant="ghost"
          state={screenshotState}
          onClick={handleTakeScreenshot}
          disabled={status === 'Taking screenshot...' || status === 'Capturing visible tab...'}
        >
          {status === 'Screenshot saved!' ? '✓ Screenshot Saved!' :
           status.includes('screenshot') || status.includes('Capturing') ? status :
           'Take Screenshot'}
        </Button>
      </Actions>
    </Card>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
