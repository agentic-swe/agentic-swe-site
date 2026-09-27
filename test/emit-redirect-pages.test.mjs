import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { renderRedirectPage, writeRedirectPages } from '../scripts/emit-redirect-pages.mjs'
import { publicRoutes, readRegistrySource } from '../scripts/site-routes.mjs'

test('every old route redirects to the same route on the agentic-swe site', () => {
  const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentic-swe-redirect-'))
  const routes = publicRoutes(readRegistrySource())
  writeRedirectPages({ distDir, routes })

  for (const route of routes) {
    const rel = route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`
    const html = fs.readFileSync(path.join(distDir, rel), 'utf8')
    const target = route.path === '/'
      ? 'https://agentic-swe.github.io/agentic-swe/'
      : `https://agentic-swe.github.io/agentic-swe${route.path}/`
    assert.ok(html.includes(`rel="canonical" href="${target}"`), `${route.path} canonical`)
    assert.ok(html.includes(`content="0; url=${target}"`), `${route.path} refresh`)
    assert.match(html, /name="robots" content="noindex, follow"/)
  }
  assert.ok(fs.existsSync(path.join(distDir, '404.html')))
})

test('the redirect script keeps the path, query, and hash under the new base', () => {
  const html = renderRedirectPage('https://agentic-swe.github.io/agentic-swe/')
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  let replaced = null
  const location = {
    pathname: '/agentic-swe-site/docs/installation/',
    search: '?q=1',
    hash: '#codex',
    replace: (url) => { replaced = url },
  }
  new Function('location', script)(location)
  assert.equal(replaced, 'https://agentic-swe.github.io/agentic-swe/docs/installation/?q=1#codex')
})
