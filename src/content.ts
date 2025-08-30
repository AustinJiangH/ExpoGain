// Content script to inject the exponential curve visualization
import React from 'react'
import { createRoot } from 'react-dom/client'
import ExponentialChart from './components/ExponentialChart'

console.log('🎬 ExpoGain: Content script loaded and ready!')
console.log('🌐 ExpoGain: URL:', window.location.href)
console.log('🔧 ExpoGain: Document state:', document.readyState)
console.log('🔧 ExpoGain: User agent:', navigator.userAgent)
console.log('🔧 ExpoGain: Chrome runtime available:', typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined')

// Add a visible indicator that the content script is loaded
if (document.body) {
  const indicator = document.createElement('div')
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: green;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    z-index: 999999;
    font-family: Arial;
    font-size: 12px;
  `
  indicator.textContent = 'ExpoGain Loaded'
  document.body.appendChild(indicator)

  // Remove indicator after 3 seconds (using a different approach)
  Promise.resolve().then(() => {
    const timer = setInterval(() => {
      indicator.remove()
      clearInterval(timer)
    }, 3000)
  })
}

// Expose debugging function globally
(window as any).expoGainDebug = () => {
  console.log('🔍 ExpoGain Debug Info:')
  console.log('- Script loaded:', true)
  console.log('- URL:', window.location.href)
  console.log('- Document ready:', document.readyState)
  console.log('- Chrome runtime:', typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined')
  console.log('- Message listener registered:', true)
  return 'ExpoGain content script is active!'
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('📬 ExpoGain: Message received in content script:', request)
  if (request.action === 'injectCurve') {
    console.log('🎨 ExpoGain: Starting curve injection...')
    try {
      injectExponentialCurve()
      console.log('✅ ExpoGain: Curve injection completed successfully!')
      sendResponse({ success: true })
    } catch (error) {
      console.error('❌ ExpoGain: Error during curve injection:', error)
      sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) })
    }
  }
  return true // Keep the message channel open for async response
})

// React-based function to inject the exponential curve
function injectExponentialCurve() {
  console.log('🔧 ExpoGain: Starting React curve creation...')
  
  // Check if curve already exists to prevent duplicates
  const existingCurve = document.querySelector('.expogain-chart-container')
  if (existingCurve) {
    console.log('🗑️ ExpoGain: Removing existing curve...')
    existingCurve.remove()
  }

  // Create container for React component
  const container = document.createElement('div')
  container.className = 'expogain-chart-container'
  
  // Add to document
  console.log('📄 ExpoGain: Adding curve container to document body...')
  document.body.appendChild(container)

  // Create React root and render component
  const root = createRoot(container)
  root.render(
    React.createElement(ExponentialChart, {
      onClose: () => {
        console.log('🗑️ ExpoGain: Closing curve...')
        root.unmount()
        container.remove()
      }
    })
  )
  
  console.log('✅ ExpoGain: React curve component rendered!')
  console.log('🎉 ExpoGain: Curve injection process completed!')
}
