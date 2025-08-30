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
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
