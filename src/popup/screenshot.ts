import { screenshotFilename, triggerDownload } from './download'
import type { StatusSink } from './status'

/**
 * Captures the visible tab, copies it to the clipboard and saves it to disk.
 *
 * The layered fallbacks are deliberate: clipboard and download are attempted
 * independently, so a failure of either still reports what did succeed. Note
 * that not every terminal branch schedules a reset back to Ready — the paths
 * that leave a message on screen do so on purpose.
 */
export async function captureAndSaveScreenshot(sink: StatusSink): Promise<void> {
  const { setStatus, setError } = sink

  setStatus('Taking screenshot...')
  setError('')

  let screenshotUrl: string | undefined

  try {
    setStatus('Capturing visible tab...')

    const currentWindow = await chrome.windows.getCurrent()

    if (!currentWindow.id) {
      setError('Cannot access current window')
      setStatus('Error')
      return
    }

    screenshotUrl = await chrome.tabs.captureVisibleTab(currentWindow.id, {
      format: 'png',
      quality: 100,
    })

    if (!screenshotUrl) {
      setError('Failed to capture screenshot')
      setStatus('Failed')
      return
    }

    setStatus('Screenshot captured!')

    const filename = screenshotFilename()

    // Convert data URL to blob for clipboard
    const response = await fetch(screenshotUrl)
    const blob = await response.blob()

    let clipboardSuccess = false

    try {
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
      clipboardSuccess = true
      setStatus('Screenshot copied to clipboard!')
      console.log('Screenshot copied to clipboard successfully')
    } catch (clipboardError) {
      console.error('Clipboard copy failed:', clipboardError)
      setStatus('Screenshot captured (clipboard failed)')
    }

    // Download as well — the link-based path works without the downloads permission
    try {
      console.log('Using fallback download method (link-based)')
      triggerDownload(screenshotUrl, filename)
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
  } catch (cause) {
    console.error('Screenshot Error:', cause)

    // The capture itself may have succeeded before a later step threw
    if (screenshotUrl) {
      try {
        console.log('Using final fallback download method')
        triggerDownload(screenshotUrl, screenshotFilename())

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
