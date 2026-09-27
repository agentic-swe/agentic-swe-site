import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertInternalRouteCoverage, assertOriginSync, assertResponsiveCss, assertSetupHosts } from './audit-checks.mjs'
import { escapeHtml } from './emit-route-pages.mjs'
import { absoluteRouteUrl, publicRoutes, readRegistrySource } from './site-routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

/** Read the Pages base from the Vite asset URLs so audit does not rebuild with a different base. */
function baseFromBuiltHtml(html) {
  const match = html.match(/(?:src|href)="(\/[^"]*?)assets\//)
  if (!match) return '/'
  return match[1].endsWith('/') ? match[1] : `${match[1]}/`
}

assertOriginSync()
assertSetupHosts()
assertResponsiveCss(fs.readFileSync(path.join(root, 'src/index.css'), 'utf8'))
assertInternalRouteCoverage()

const distIndex = path.join(root, 'dist/index.html')
if (!fs.existsSync(distIndex)) {
  console.log('audit: source checks passed; dist/ is absent so generated files were not rechecked')
} else {
  const base = baseFromBuiltHtml(fs.readFileSync(distIndex, 'utf8'))
  const routes = publicRoutes(readRegistrySource())
  const missing = []
  for (const route of routes) {
    const file = route.path === '/'
      ? distIndex
      : path.join(root, 'dist', route.path.slice(1), 'index.html')
    if (!fs.existsSync(file)) {
      missing.push(route.path)
      continue
    }
    const html = fs.readFileSync(file, 'utf8')
    const url = absoluteRouteUrl(route.path, base)
    if (!html.includes(`<title>${escapeHtml(route.title)}</title>`)) missing.push(`${route.path} title`)
    if (!html.includes(`rel="canonical" href="${url}"`)) missing.push(`${route.path} canonical`)
    if (!html.includes(`property="og:url" content="${url}"`)) missing.push(`${route.path} og:url`)
    if (!html.includes(`name="twitter:url" content="${url}"`)) missing.push(`${route.path} twitter:url`)
    if (!html.includes('name="twitter:description"')) missing.push(`${route.path} twitter:description`)
  }
  const sitemap = fs.existsSync(path.join(root, 'dist/sitemap.xml'))
    ? fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8')
    : ''
  const robots = fs.existsSync(path.join(root, 'dist/robots.txt'))
    ? fs.readFileSync(path.join(root, 'dist/robots.txt'), 'utf8')
    : ''
  const sitemapUrl = `${absoluteRouteUrl('/', base).replace(/\/$/, '')}/sitemap.xml`
  if (!sitemap.includes(`<loc>${absoluteRouteUrl('/evaluate', base)}</loc>`)) missing.push('sitemap evaluate')
  if (!sitemap.includes(absoluteRouteUrl('/docs/installation', base))) missing.push('sitemap installation')
  if (!robots.includes(`Sitemap: ${sitemapUrl}`)) missing.push('robots sitemap')
  if (missing.length) fail(`generated route audit failed:\n${missing.join('\n')}`)
  else console.log(`audit: ${routes.length} routes, sitemap, and robots checked under dist/ (base ${base})`)
}

if (process.exitCode) process.exit(process.exitCode)
