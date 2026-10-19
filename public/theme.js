/** Applies the saved colour preference before the first paint; storage can be blocked by the browser. */
(() => {
  try {
    const savedTheme = localStorage.getItem('anu3ev-theme')
    document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark'
  } catch (error) {
    document.documentElement.dataset.theme = 'dark'
    console.error('Could not read the colour preference', error)
  }
})()
