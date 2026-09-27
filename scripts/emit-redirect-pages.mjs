import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { escapeHtml } from './emit-route-pages.mjs'
import {
  LEGACY_BASE,
  PUBLIC_BASE,
  SITE_ORIGIN,
  absoluteRouteUrl,
  publicRoutes,
  readRegistrySource,
} from './site-routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * One page per old URL. The meta refresh covers visitors without JavaScript;
 * the script keeps the query string and #hash, which a refresh would drop.
 */
export function renderRedirectPage(target, { legacyBase = LEGACY_BASE, publicBase = PUBLIC_BASE } = {}) {
  const href = escapeHtml(target)
  const mapping = JSON.stringify({ from: legacyBase, to: `${SITE_ORIGIN}${publicBase}` })
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Agentic SWE has moved</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${href}" />
    <meta http-equiv="refresh" content="0; url=${href}" />
    <script>
      (function () {
        var m = ${mapping};
        var p = location.pathname;
        var rest = p.indexOf(m.from) === 0 ? p.slice(m.from.length) : '';
        location.replace(m.to + rest + location.search + location.hash);
      })();
    </script>
  </head>
  <body>
    <p>Agentic SWE has moved to <a href="${href}">${href}</a>.</p>
  </body>
</html>
`
}

export function writeRedirectPages({ distDir, routes, publicBase = PUBLIC_BASE, legacyBase = LEGACY_BASE }) {
  fs.rmSync(distDir, { recursive: true, force: true })
  fs.mkdirSync(distDir, { recursive: true })
  const written = []
  for (const route of routes) {
    const html = renderRedirectPage(absoluteRouteUrl(route.path, publicBase), { legacyBase, publicBase })
    const rel = route.path === '/' ? 'index.html' : `${route.path.replace(/^\//, '')}/index.html`
    fs.mkdirSync(path.dirname(path.join(distDir, rel)), { recursive: true })
    fs.writeFileSync(path.join(distDir, rel), html)
    written.push(rel)
  }
  fs.writeFileSync(
    path.join(distDir, '404.html'),
    renderRedirectPage(absoluteRouteUrl('/', publicBase), { legacyBase, publicBase }),
  )
  fs.writeFileSync(path.join(distDir, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  written.push('404.html', 'robots.txt')
  return written
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isCli) {
  const distDir = path.join(root, 'dist-redirect')
  const written = writeRedirectPages({ distDir, routes: publicRoutes(readRegistrySource()) })
  console.log(`emit-redirect-pages: wrote ${written.length} files under dist-redirect/ → ${SITE_ORIGIN}${PUBLIC_BASE}`)
}
