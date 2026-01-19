document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle')
  const menu = document.querySelector('.mobile-nav')
  const closeBtn = document.querySelector('.mobile-nav-close')
  const links = document.querySelectorAll('.mobile-drawer-links a')

  if (!toggle || !menu) return

  const openMenu = () => {
    menu.classList.add('open')
    menu.setAttribute('aria-hidden', 'false')
    toggle.setAttribute('aria-expanded', 'true')
    document.body.classList.add('nav-open')
  }

  const closeMenu = () => {
    menu.classList.remove('open')
    menu.setAttribute('aria-hidden', 'true')
    toggle.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('nav-open')
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu)
  }

  menu.addEventListener('click', (event) => {
    if (event.target === menu) {
      closeMenu()
    }
  })

  links.forEach((link) => {
    link.addEventListener('click', closeMenu)
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu()
    }
  })
})
