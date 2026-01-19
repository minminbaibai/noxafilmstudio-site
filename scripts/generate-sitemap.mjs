import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://www.noxafilmstudio.com'
const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')
const excludedDirs = new Set(['node_modules', 'scripts', 'dist', '.git'])

const copyDir = (source, target) => {
  fs.mkdirSync(target, { recursive: true })
  const entries = fs.readdirSync(source, { withFileTypes: true })
  entries.forEach((entry) => {
    if (excludedDirs.has(entry.name)) return
    const srcPath = path.join(source, entry.name)
    const destPath = path.join(target, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
      return
    }
    if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

const routes = [
  '/',
  '/ai-film-studio/',
  '/trailer/',
  '/trailer2/',
  '/trailer3/',
  '/applynow/',
  '/submitscript/',
  '/investment_page/',
  '/privacy/',
  '/terms/',
]

const sitemapEntries = routes.map((route) => `${BASE_URL}${route}`)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${sitemapEntries.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n` +
  `</urlset>\n`

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap)

fs.mkdirSync(distDir, { recursive: true })
copyDir(rootDir, distDir)
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

const robotsPath = path.join(rootDir, 'robots.txt')
if (fs.existsSync(robotsPath)) {
  fs.copyFileSync(robotsPath, path.join(distDir, 'robots.txt'))
}
