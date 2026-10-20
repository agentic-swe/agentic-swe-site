import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BLOG_POSTS,
  absoluteRouteUrl,
  publicRoutes,
  readRegistrySource,
  viteBase,
} from './site-routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function upsertMeta(html, attr, key, content) {
  const tag = `<meta ${attr}="${key}" content="${content}" />`
  const pattern = new RegExp(`<meta\\b[^>]*\\b${attr}=["']${escapeRegExp(key)}["'][^>]*>`, 'i')
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function upsertCanonical(html, url) {
  const tag = `<link rel="canonical" href="${url}" />`
  const pattern = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function upsertSitemap(html, url) {
  const tag = `<link rel="sitemap" type="application/xml" href="${url}" />`
  const pattern = /<link\b[^>]*\brel=["']sitemap["'][^>]*>/i
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

export function applyRouteMeta(html, route, url, {
  socialImageUrl,
  sitemapUrl,
} = {}) {
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)
  const canonical = escapeHtml(url)
  let next = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  if (!/<title>/.test(next)) {
    next = next.replace('</head>', `    <title>${title}</title>\n  </head>`)
  }
  next = upsertMeta(next, 'name', 'description', description)
  next = upsertMeta(next, 'property', 'og:title', title)
  next = upsertMeta(next, 'property', 'og:description', description)
  next = upsertMeta(next, 'property', 'og:url', canonical)
  next = upsertMeta(next, 'name', 'twitter:title', title)
  next = upsertMeta(next, 'name', 'twitter:description', description)
  next = upsertMeta(next, 'name', 'twitter:url', canonical)
  next = upsertMeta(next, 'name', 'robots', 'index, follow')
  if (socialImageUrl) {
    const image = escapeHtml(socialImageUrl)
    next = upsertMeta(next, 'property', 'og:image', image)
    next = upsertMeta(next, 'name', 'twitter:image', image)
  }
  next = upsertCanonical(next, canonical)
  if (sitemapUrl) next = upsertSitemap(next, escapeHtml(sitemapUrl))
  return next
}

export function renderSitemap(routes, base) {
  const urls = routes
    .map((route) => `  <url><loc>${escapeHtml(absoluteRouteUrl(route.path, base))}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function siteFileUrl(filePath, base = viteBase(), origin) {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '')
  const file = filePath.startsWith('/') ? filePath : `/${filePath}`
  const host = origin ?? absoluteRouteUrl('/', base).replace(/\/$/, '')
  return `${host}${file}`
}

export function renderRobots(base) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteFileUrl('/sitemap.xml', base)}\n`
}

/** RFC 822 date at midnight UTC; posts carry calendar dates, not times. */
function rssDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) throw new Error(`invalid blog post date ${isoDate}`)
  return date.toUTCString()
}

/** RSS 2.0 feed. `lastBuildDate` is the newest post date so rebuilds stay byte-identical. */
export function renderRss(posts, base) {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  const blogUrl = escapeHtml(absoluteRouteUrl('/blog', base))
  const feedUrl = escapeHtml(siteFileUrl('/rss.xml', base))
  const items = sorted
    .map((post) => {
      const url = escapeHtml(absoluteRouteUrl(`/blog/${post.slug}`, base))
      return [
        '    <item>',
        `      <title>${escapeHtml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rssDate(post.date)}</pubDate>`,
        `      <description>${escapeHtml(post.description)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')
  const lastBuild = sorted[0] ? `\n    <lastBuildDate>${rssDate(sorted[0].date)}</lastBuildDate>` : ''
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Agentic SWE blog</title>
    <link>${blogUrl}</link>
    <description>Release notes, design decisions, and field notes for the Agentic SWE local workflow pack.</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />${lastBuild}
${items}
  </channel>
</rss>
`
}

export function writeRoutePages({
  distDir,
  indexHtml,
  routes,
  base,
  posts = BLOG_POSTS,
}) {
  fs.mkdirSync(distDir, { recursive: true })
  const written = []
  const socialImageUrl = siteFileUrl('/media/agentic-swe-social.png', base)
  const sitemapUrl = siteFileUrl('/sitemap.xml', base)
  for (const route of routes) {
    const url = absoluteRouteUrl(route.path, base)
    const html = applyRouteMeta(indexHtml, route, url, { socialImageUrl, sitemapUrl })
    if (route.path === '/') {
      fs.writeFileSync(path.join(distDir, 'index.html'), html)
      fs.writeFileSync(path.join(distDir, '404.html'), html)
      written.push('index.html', '404.html')
      continue
    }
    const dir = path.join(distDir, route.path.replace(/^\//, ''))
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), html)
    written.push(`${route.path.replace(/^\//, '')}/index.html`)
  }
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), renderSitemap(routes, base))
  fs.writeFileSync(path.join(distDir, 'robots.txt'), renderRobots(base))
  fs.writeFileSync(path.join(distDir, 'rss.xml'), renderRss(posts, base))
  written.push('sitemap.xml', 'robots.txt', 'rss.xml')
  return written
}

export function emitDistRoutePages({
  distDir = path.join(root, 'dist'),
  base = viteBase(),
  registrySource = readRegistrySource(),
} = {}) {
  const indexPath = path.join(distDir, 'index.html')
  const indexHtml = fs.readFileSync(indexPath, 'utf8')
  const routes = publicRoutes(registrySource)
  return writeRoutePages({ distDir, indexHtml, routes, base })
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isCli) {
  const written = emitDistRoutePages()
  console.log(`emit-route-pages: wrote ${written.length} files under dist/`)
}
