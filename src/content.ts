// Content script to inject the exponential curve visualization

console.log('🎬 ExpoGain: Content script loaded and ready!')
console.log('🌐 ExpoGain: URL:', window.location.href)
console.log('🔧 ExpoGain: Document state:', document.readyState)
console.log('🔧 ExpoGain: User agent:', navigator.userAgent)
console.log('🔧 ExpoGain: Chrome runtime available:', typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined')

// Content script is now confirmed working - removed alert

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

// Function to inject the draggable exponential curve
function injectExponentialCurve() {
  console.log('🔧 ExpoGain: Starting curve creation...')
  
  // Check if curve already exists to prevent duplicates
  const existingCurve = document.querySelector('.expogain-curve-container')
  if (existingCurve) {
    console.log('🗑️ ExpoGain: Removing existing curve...')
    existingCurve.remove()
  }

  // Create draggable div with centered exponential curve y = e^(ax) + b
  const div = document.createElement('div')
  div.className = 'expogain-curve-container'
  div.style.cssText = `
    position: fixed;
    width: 60vh;
    height: 60vh;
    background: rgba(255,255,255,0.05);
    border: 2px solid #777;
    top: 100px;
    left: 100px;
    z-index: 10000;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  `

  // Create and style the canvas
  const canvas = document.createElement('canvas')
  canvas.style.cssText = `
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 10px;
  `
  div.appendChild(canvas)

  // Create close button
  const closeButton = document.createElement('div')
  closeButton.style.cssText = `
    position: absolute;
    top: -15px;
    right: -15px;
    width: 24px;
    height: 24px;
    background: #ff4444;
    border: 2px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 10001;
    transition: all 0.2s ease;
  `
  closeButton.innerHTML = '×'
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.transform = 'scale(1.1)'
    closeButton.style.background = '#ff6666'
  })
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.transform = 'scale(1)'
    closeButton.style.background = '#ff4444'
  })
  closeButton.addEventListener('click', () => {
    div.remove()
  })
  div.appendChild(closeButton)

  // Create inner drag area
  const dragArea = document.createElement('div')
  dragArea.style.cssText = `
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    cursor: move;
  `
  div.appendChild(dragArea)

  // Create resize handles
  const positions = [
    { class: 'nw', cursor: 'nw-resize', top: 0, left: 0 },
    { class: 'n', cursor: 'n-resize', top: 0, left: '50%' },
    { class: 'ne', cursor: 'ne-resize', top: 0, right: 0 },
    { class: 'w', cursor: 'w-resize', top: '50%', left: 0 },
    { class: 'e', cursor: 'e-resize', top: '50%', right: 0 },
    { class: 'sw', cursor: 'sw-resize', bottom: 0, left: 0 },
    { class: 's', cursor: 's-resize', bottom: 0, left: '50%' },
    { class: 'se', cursor: 'se-resize', bottom: 0, right: 0 },
  ]

  const handles = positions.map((pos) => {
    const handle = document.createElement('div')
    handle.className = `resize-handle ${pos.class}`
    handle.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: #666;   
      border-radius: 50%;
      z-index: 1;
      cursor: ${pos.cursor};
      ${pos.top !== undefined ? `top: ${pos.top};` : ''}
      ${pos.bottom !== undefined ? `bottom: ${pos.bottom};` : ''}
      ${pos.left !== undefined ? `left: ${pos.left};` : ''}
      ${pos.right !== undefined ? `right: ${pos.right};` : ''}
      ${pos.top === '50%' || pos.left === '50%' ? 'transform: translate(-50%, -50%);' : ''}
    `
    div.appendChild(handle)
    return handle
  })

  // Add to document
  console.log('📄 ExpoGain: Adding curve to document body...')
  document.body.appendChild(div)
  console.log('✅ ExpoGain: Curve element added to DOM!')

  // Draw function
  const drawCurve = () => {
    console.log('🎨 ExpoGain: Drawing curve on canvas...')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get device pixel ratio for high-DPI displays
    const dpr = window.devicePixelRatio || 1
    const displayWidth = div.clientWidth
    const displayHeight = div.clientHeight

    // Set canvas dimensions accounting for device pixel ratio
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr

    // Scale the canvas back down using CSS
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    // Scale the drawing context so everything is drawn at the correct size
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, displayWidth, displayHeight)

    // Set up coordinate system
    const xMin = -2.5
    const xMax = 2.5
    const yMin = -2
    const yMax = 6 // Adjusted to show more of the exponential curve

    // Parameters for y = e^(ax) + b
    const a = 1 // Growth rate
    const b = 0 // Y-intercept shift

    // Transform functions
    const transformX = (x: number) => ((x - xMin) * displayWidth) / (xMax - xMin)
    const transformY = (y: number) => displayHeight - ((y - yMin) * displayHeight) / (yMax - yMin)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 1

    // X-axis
    const yAxisY = transformY(0)
    ctx.moveTo(0, yAxisY)
    ctx.lineTo(displayWidth, yAxisY)

    // Y-axis
    const xAxisX = transformX(0)
    ctx.moveTo(xAxisX, 0)
    ctx.lineTo(xAxisX, displayHeight)
    ctx.stroke()

    // Draw exponential curve
    ctx.beginPath()
    ctx.strokeStyle = '#FF6B6B'
    ctx.lineWidth = 2

    // Draw curve with more points for smoothness
    const points = 200
    for (let i = 0; i <= points; i++) {
      const x = xMin + (i * (xMax - xMin)) / points
      const y = Math.exp(a * x) + b
      const canvasX = transformX(x)
      const canvasY = transformY(y)

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 0.5
    ctx.setLineDash([2, 2])

    // Vertical grid lines
    for (let x = xMin; x <= xMax; x++) {
      if (x !== 0) {
        const canvasX = transformX(x)
        ctx.beginPath()
        ctx.moveTo(canvasX, 0)
        ctx.lineTo(canvasX, displayHeight)
        ctx.stroke()
      }
    }

    // Horizontal grid lines
    for (let y = yMin; y <= yMax; y++) {
      if (y !== 0) {
        const canvasY = transformY(y)
        ctx.beginPath()
        ctx.moveTo(0, canvasY)
        ctx.lineTo(displayWidth, canvasY)
        ctx.stroke()
      }
    }
    ctx.setLineDash([])

    // Add numbers to axes
    ctx.fillStyle = '#666'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // X-axis numbers
    for (let x = xMin; x <= xMax; x++) {
      if (x !== 0) {
        const canvasX = transformX(x)
        ctx.fillText(x.toString(), canvasX, yAxisY + 5)
      }
    }

    // Y-axis numbers
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let y = yMin; y <= yMax; y++) {
      if (y !== 0) {
        const canvasY = transformY(y)
        ctx.fillText(y.toString(), xAxisX - 5, canvasY)
      }
    }
  }

  // Resize and drag logic
  let isResizing = false
  let isDragging = false
  let currentHandle: HTMLElement | null = null
  let startX: number, startY: number, startWidth: number, startHeight: number, startLeft: number, startTop: number

  // Handle resize start
  handles.forEach((handle) => {
    handle.addEventListener('mousedown', (e) => {
      isResizing = true
      currentHandle = handle
      startX = e.clientX
      startY = e.clientY
      startWidth = div.offsetWidth
      startHeight = div.offsetHeight
      startLeft = div.offsetLeft
      startTop = div.offsetTop
      e.stopPropagation()
    })
  })

  // Handle drag start
  dragArea.addEventListener('mousedown', (e) => {
    if (!isResizing) {
      isDragging = true
      startX = e.clientX - div.offsetLeft
      startY = e.clientY - div.offsetTop
      e.stopPropagation()
    }
  })

  // Handle mouse move
  document.addEventListener('mousemove', (e) => {
    if (isResizing && currentHandle) {
      const dx = e.clientX - startX
      const dy = e.clientY - startY

      // Determine resize behavior based on handle class
      const handleClass = currentHandle.className.split(' ')[1]
      let newWidth = startWidth
      let newHeight = startHeight
      let newLeft = startLeft
      let newTop = startTop

      if (handleClass.includes('e')) newWidth = startWidth + dx
      if (handleClass.includes('w')) {
        newWidth = startWidth - dx
        newLeft = startLeft + dx
      }
      if (handleClass.includes('s')) newHeight = startHeight + dy
      if (handleClass.includes('n')) {
        newHeight = startHeight - dy
        newTop = startTop + dy
      }

      // Apply minimum size constraints
      if (newWidth > 100 && newHeight > 100) {
        div.style.width = `${newWidth}px`
        div.style.height = `${newHeight}px`
        div.style.left = `${newLeft}px`
        div.style.top = `${newTop}px`
        drawCurve()
      }
    } else if (isDragging) {
      div.style.left = `${e.clientX - startX}px`
      div.style.top = `${e.clientY - startY}px`
    }
  })

  // Handle mouse up
  document.addEventListener('mouseup', () => {
    isResizing = false
    isDragging = false
    currentHandle = null
  })

  // Initial draw
  console.log('🖌️ ExpoGain: Calling initial draw...')
  drawCurve()
  console.log('🎉 ExpoGain: Curve injection process completed!')
}
