import type { ExpoGainRequest, ExpoGainResponse } from '../messages'
import type { InjectionSink } from './status'

/** Pages the content script is never injected into, so there is nobody to message */
const UNSUPPORTED_SCHEMES = [
  'chrome://',
  'chrome-extension://',
  'edge://',
  'about:',
  'moz-extension://',
]

/**
 * Asks the content script in the active tab to inject the curve.
 *
 * Runs synchronously up to the first await, which is what keeps the early
 * statuses batching exactly as they always have.
 */
export async function requestCurveInjection(sink: InjectionSink): Promise<void> {
  const { setStatus, setError, setInjected } = sink

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

    if (UNSUPPORTED_SCHEMES.some((scheme) => tab.url!.startsWith(scheme))) {
      setError('Cannot inject on browser internal pages. Please navigate to a regular website.')
      setStatus('Error')
      return
    }

    setStatus('Sending message to content script...')

    const request: ExpoGainRequest = { action: 'injectCurve' }
    const response: ExpoGainResponse | undefined = await chrome.tabs.sendMessage(tab.id, request)

    if (response && response.success) {
      setStatus('Injected!')
      setInjected(true)
      setTimeout(() => {
        setInjected(false)
        setStatus('Ready')
      }, 2000)
    } else {
      setError('Content script did not respond properly')
      setStatus('Failed')
    }
  } catch (cause) {
    console.error('ExpoGain Error:', cause)
    setError(
      'Content script not found. Make sure you are on a regular website (not chrome:// pages) and try refreshing the page.',
    )
    setStatus('Failed')
  }
}
