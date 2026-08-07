/**
 * Saving a captured screenshot to disk.
 *
 * The anchor-click dance is the fallback that works without the downloads
 * permission, and it was previously copy-pasted at two call sites.
 */

/** Clicks a temporary anchor to save a data URL under the given filename */
export function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * A timestamped filename for a screenshot.
 *
 * Call this at the moment of saving — the two call sites deliberately stamp
 * their own times rather than sharing one.
 */
export function screenshotFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `expogain-screenshot-${timestamp}.png`
}
