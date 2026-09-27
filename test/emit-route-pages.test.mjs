import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { applyRouteMeta, escapeHtml, renderRobots, renderSitemap, writeRoutePages } from '../scripts/emit-route-pages.mjs'
import { publicRoutes, readRegistrySource } from '../scripts/site-routes.mjs'

const shell = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="description"
      content="old description"
    />
    <meta property="og:title" content="old title" />
    <meta
      property="og:description"
      content="old og"
    />
    <meta name="twitter:title" content="old twitter" />
    <meta name="twitter:description" content="old twitter body" />
    <title>Old title</title>
  </head>
  <body><div id="root"></div></body>
</html>
`

test('route html receives title, description, canonical, and social URLs', () => {
  const html = applyRouteMeta(
    shell,
    {
      path: '/evaluate',
      title: 'Evaluate & review · Agentic SWE',
      description: 'Honest "status" for readers',
    },
    'https://agentic-swe.github.io/agentic-swe-site/evaluate/',
  )
  assert.match(html, /<title>Evaluate &amp; review · Agentic SWE<\/title>/)
  assert.match(html, /name="description" content="Honest &quot;status&quot; for readers"/)
  assert.match(html, /property="og:url" content="https:\/\/agentic-swe.github.io\/agentic-swe-site\/evaluate\/"/)
  assert.match(html, /name="twitter:url" content="https:\/\/agentic-swe.github.io\/agentic-swe-site\/evaluate\/"/)
  assert.match(html, /rel="canonical" href="https:\/\/agentic-swe.github.io\/agentic-swe-site\/evaluate\/"/)
  assert.doesNotMatch(html, /old description/)
  assert.doesNotMatch(html, /Old title/)
})

test('every public route is emitted as a directory index plus sitemap and robots', () => {
  const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentic-swe-site-'))
  const routes = publicRoutes(readRegistrySource())
  const base = '/agentic-swe-site/'
  writeRoutePages({ distDir, indexHtml: shell, routes, base })

  for (const route of routes) {
    const file = route.path === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.path.slice(1), 'index.html')
    const html = fs.readFileSync(file, 'utf8')
    const escapedTitle = escapeHtml(route.title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    assert.match(html, new RegExp(`<title>${escapedTitle}</title>`))
    assert.match(html, /rel="canonical"/)
    assert.match(html, new RegExp(route.path === '/' ? '/agentic-swe-site/' : `${route.path}/`))
    assert.match(
      html,
      /property="og:image" content="https:\/\/agentic-swe\.github\.io\/agentic-swe-site\/media\/agentic-swe-social\.png"/,
    )
    assert.match(
      html,
      /rel="sitemap" type="application\/xml" href="https:\/\/agentic-swe\.github\.io\/agentic-swe-site\/sitemap\.xml"/,
    )
    assert.match(html, /name="robots" content="index, follow"/)
  }

  const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8')
  assert.equal(sitemap, renderSitemap(routes, base))
  assert.match(sitemap, /\/agentic-swe-site\/evaluate\/</)
  assert.match(sitemap, /\/docs\/installation\/</)
  assert.equal(sitemap.match(/<loc>/g).length, routes.length)

  const robots = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8')
  assert.equal(robots, renderRobots(base))
  assert.match(robots, /^Sitemap: https:\/\/agentic-swe.github.io\/agentic-swe-site\/sitemap.xml$/m)
  assert.equal(fs.existsSync(path.join(distDir, '404.html')), true)
})
