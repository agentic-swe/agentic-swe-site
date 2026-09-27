import assert from 'node:assert/strict'
import test from 'node:test'
import {
  absoluteRouteUrl,
  docRoutesFromRegistry,
  parseDocSlugs,
  parseLegacyRedirects,
  publicRoutes,
  readRegistrySource,
} from '../scripts/site-routes.mjs'
import { MARKETING_ROUTES } from '../src/seo/marketing-routes.js'
import { assertInternalRouteCoverage, assertOriginSync } from '../scripts/audit-checks.mjs'

const registry = readRegistrySource()

test('public routes include marketing pages and every doc slug', () => {
  const routes = publicRoutes(registry)
  const paths = new Set(routes.map((route) => route.path))
  for (const route of MARKETING_ROUTES) {
    assert.equal(paths.has(route.path), true, route.path)
  }
  for (const slug of parseDocSlugs(registry)) {
    assert.equal(paths.has(`/docs/${slug}`), true, slug)
    const route = routes.find((item) => item.path === `/docs/${slug}`)
    assert.match(route.title, / · Agentic SWE$/)
    assert.ok(route.description.length > 20)
  }
  assert.equal(routes.length, MARKETING_ROUTES.length + parseDocSlugs(registry).length)
})

test('doc descriptions are read from registry source, not invented', () => {
  const installation = docRoutesFromRegistry(registry).find((route) => route.path === '/docs/installation')
  assert.match(installation.description, /Claude Code/)
  assert.doesNotMatch(installation.description, /in the Agentic SWE documentation\.$/)
})

test('legacy markdown URLs redirect at slugs that exist', () => {
  const slugs = new Set(parseDocSlugs(registry))
  const redirects = parseLegacyRedirects(registry)
  assert.ok(redirects.length > 10)
  for (const redirect of redirects) {
    assert.equal(slugs.has(redirect.slug), true, redirect.from)
  }
})

test('canonical URLs are trailing-slash locations on the project site', () => {
  assert.equal(
    absoluteRouteUrl('/evaluate', '/agentic-swe/'),
    'https://agentic-swe.github.io/agentic-swe/evaluate/',
  )
  assert.equal(
    absoluteRouteUrl('/', '/agentic-swe/'),
    'https://agentic-swe.github.io/agentic-swe/',
  )
})

test('internal links and the site origin stay covered', () => {
  assertOriginSync()
  assertInternalRouteCoverage()
})
