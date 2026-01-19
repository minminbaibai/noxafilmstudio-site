document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video')

  videos.forEach((video) => {
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const container =
      video.closest('.video-wrapper') ||
      video.closest('.cities-image') ||
      video.closest('.character-image') ||
      video.parentElement

    if (!container || container.querySelector('.video-fullscreen-btn')) {
      return
    }

    container.classList.add('video-fullscreen-container')

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'video-fullscreen-btn'
    button.textContent = 'Fullscreen'
    button.setAttribute('aria-label', 'Open video in fullscreen')

    button.addEventListener('click', (event) => {
      event.stopPropagation()
      if (typeof video.webkitEnterFullscreen === 'function') {
        video.webkitEnterFullscreen()
      } else if (typeof video.requestFullscreen === 'function') {
        video.requestFullscreen()
      }
    })

    container.appendChild(button)
  })
})
