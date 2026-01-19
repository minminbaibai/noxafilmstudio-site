import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://www.noxafilmstudio.com'
const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')

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

// 只把“真正需要对外部署”的内容复制到 dist（白名单）
// 目录：站点资源与子页面目录
const WHITELIST_DIRS = [
  'css',
  'js',
  'images',
  'trailer',
  'trailer2',
  'trailer3',
  'applynow',
  'submitscript',
  'investment_page',
  'privacy',
  'terms',
  'ai-film-studio',
]

// 文件：站点入口与 Azure SWA 配置、favicon 等
const WHITELIST_FILES = [
  'index.html',
  'staticwebapp.config.json',
  'robots.txt',
  'favicon.ico',
  'favicon-48.png',
  'CNAME', // 若你们有自定义域文件就一起带上（不存在会自动跳过）
]

const buildSitemapXml = (fullUrls) => {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${fullUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n` +
    `</urlset>\n`
  )
}

const ensureRobotsTxt = () => {
  const robotsPath = path.join(rootDir, 'robots.txt')
  if (fs.existsSync(robotsPath)) return
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`
  fs.writeFileSync(robotsPath, content)
}

const safeCopy = (srcPath, destPath) => {
  if (!fs.existsSync(srcPath)) return
  const stat = fs.statSync(srcPath)
  if (stat.isDirectory()) {
    fs.mkdirSync(destPath, { recursive: true })
    const entries = fs.readdirSync(srcPath, { withFileTypes: true })
    entries.forEach((entry) => {
      const from = path.join(srcPath, entry.name)
      const to = path.join(destPath, entry.name)
      if (entry.isDirectory()) safeCopy(from, to)
      else if (entry.isFile()) {
        fs.mkdirSync(path.dirname(to), { recursive: true })
        fs.copyFileSync(from, to)
      }
    })
    return
  }
  if (stat.isFile()) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    fs.copyFileSync(srcPath, destPath)
  }
}

const main = () => {
  // 1) 确保 robots.txt 存在（root）
  ensureRobotsTxt()

  // 2) 生成 sitemap.xml（root + dist）
  const sitemapUrls = routes.map((route) => `${BASE_URL}${route}`)
  const sitemap = buildSitemapXml(sitemapUrls)

  // root 写一份（方便 output_location 部署根目录时直接可用）
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap)

  // 3) dist 干净生成
  fs.rmSync(distDir, { recursive: true, force: true })
  fs.mkdirSync(distDir, { recursive: true })

  // 4) 白名单复制到 dist（避免把 .github / scripts 等部署出去）
  WHITELIST_DIRS.forEach((dirName) => {
    safeCopy(path.join(rootDir, dirName), path.join(distDir, dirName))
  })
  WHITELIST_FILES.forEach((fileName) => {
    safeCopy(path.join(rootDir, fileName), path.join(distDir, fileName))
  })

  // 5) dist 写 sitemap.xml（覆盖写）
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

  // 6) 再保险：dist 若没有 robots.txt，补一份
  const distRobots = path.join(distDir, 'robots.txt')
  if (!fs.existsSync(distRobots)) {
    const content = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`
    fs.writeFileSync(distRobots, content)
  }

  console.log('[noxa-site] dist build complete:', distDir)
  console.log('[noxa-site] wrote sitemap:', path.join(rootDir, 'sitemap.xml'))
  console.log('[noxa-site] wrote sitemap:', path.join(distDir, 'sitemap.xml'))
}

main()
