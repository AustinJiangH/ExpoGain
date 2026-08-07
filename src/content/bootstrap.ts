import type { ExpoGainResponse } from '../messages'
import { injectExponentialCurve } from './mountChart'

/**
 * Content-script startup: the diagnostics, the loaded badge, the debug hook
 * and the message listener.
 *
 * These run at module evaluation on every page the manifest matches, so each
 * step is kept synchronous and in the order it has always run.
 */

/** Diagnostics printed on every matched page load */
export function logStartup(): void {
  console.log('🎬 ExpoGain: Content script loaded and ready!')
  console.log('🌐 ExpoGain: URL:', window.location.href)
  console.log('🔧 ExpoGain: Document state:', document.readyState)
  console.log('🔧 ExpoGain: User agent:', navigator.userAgent)
  console.log(
    '🔧 ExpoGain: Chrome runtime available:',
    typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined',
  )
}

/** A transient badge confirming the script reached the page */
export function showLoadedIndicator(): void {
  if (!document.body) return

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

  setTimeout(() => indicator.remove(), 3000)
}

/**
 * Exposes expoGainDebug() for manual inspection.
 *
 * Note this lands on the isolated world's window, so it is reachable from the
 * extension's content-script context in DevTools, not the page's own context.
 */
export function installDebugHook(): void {
  window.expoGainDebug = () => {
    console.log('🔍 ExpoGain Debug Info:')
    console.log('- Script loaded:', true)
    console.log('- URL:', window.location.href)
    console.log('- Document ready:', document.readyState)
    console.log(
      '- Chrome runtime:',
      typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined',
    )
    console.log('- Message listener registered:', true)
    return 'ExpoGain content script is active!'
  }
}

/** Handles injectCurve requests from the popup */
export function listenForMessages(): void {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    console.log('📬 ExpoGain: Message received in content script:', request)
    if (request.action === 'injectCurve') {
      console.log('🎨 ExpoGain: Starting curve injection...')
      try {
        injectExponentialCurve()
        console.log('✅ ExpoGain: Curve injection completed successfully!')
        sendResponse({ success: true } satisfies ExpoGainResponse)
      } catch (error) {
        console.error('❌ ExpoGain: Error during curve injection:', error)
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        } satisfies ExpoGainResponse)
      }
    }
    return true // Keep the message channel open for async response
  })
}
