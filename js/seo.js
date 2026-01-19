const config = window.SEO_CONFIG || {}
const baseUrl = config.baseUrl || 'https://www.noxafilmstudio.com'

const normalizePath = (pathname = '/') => {
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

const upsertMeta = (attr, key, content) => {
  if (!content) return
  const selector = `meta[${attr}="${key}"]`
  let element = document.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const upsertLink = (rel, href) => {
  if (!href) return
  const selector = `link[rel="${rel}"]`
  let element = document.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const removeJsonLd = () => {
  document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove())
}

const insertJsonLd = (data) => {
  if (!data) return
  const items = Array.isArray(data) ? data : [data]
  items.filter(Boolean).forEach((item) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-jsonld', 'true')
    script.textContent = JSON.stringify(item).replace(/</g, '\\u003c')
    document.head.appendChild(script)
  })
}

const path = normalizePath(window.location.pathname)
const routeConfig = (config.routes && (config.routes[path] || config.routes['/'])) || {}
const canonicalUrl = routeConfig.canonical || `${baseUrl}${path}`

if (routeConfig.title) {
  document.title = routeConfig.title
}

upsertMeta('name', 'description', routeConfig.description)
upsertMeta('property', 'og:title', routeConfig.ogTitle || routeConfig.title)
upsertMeta('property', 'og:description', routeConfig.ogDescription || routeConfig.description)
upsertMeta('property', 'og:type', routeConfig.ogType || 'website')
upsertMeta('property', 'og:url', canonicalUrl)
upsertLink('canonical', canonicalUrl)

removeJsonLd()
insertJsonLd(routeConfig.jsonLd)
