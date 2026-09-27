import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MARKETING_ROUTES } from '../src/seo/marketing-routes.js'

/** Keep in sync with `SITE_ORIGIN` in src/data/project-status.ts */
export const SITE_ORIGIN = 'https://agentic-swe.github.io'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export { MARKETING_ROUTES }

export function viteBase(raw = process.env.VITE_BASE) {
  const value = raw?.trim()
  if (!value || value === '/') return '/'
  const withSlashes = value.startsWith('/') ? value : `/${value}`
  return withSlashes.endsWith('/') ? withSlashes : `${withSlashes}/`
}

export function readRegistrySource(registryPath = path.join(root, 'src/docs/registry.ts')) {
  return fs.readFileSync(registryPath, 'utf8')
}

function quotedStrings(block) {
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1])
}

export function parseDocSlugs(source) {
  const match = source.match(/export const DOC_SLUGS = \[([\s\S]*?)\] as const/)
  if (!match) throw new Error('DOC_SLUGS array not found in registry source')
  const slugs = quotedStrings(match[1])
  if (slugs.length === 0) throw new Error('DOC_SLUGS parsed empty')
  return slugs
}

function readQuoted(source, start) {
  if (source[start] !== "'") return null
  let value = ''
  for (let i = start + 1; i < source.length; i += 1) {
    const char = source[i]
    if (char === '\\') {
      value += source[i + 1] ?? ''
      i += 1
      continue
    }
    if (char === "'") return { value, end: i + 1 }
    value += char
  }
  return null
}

export function parseDocMeta(source) {
  const start = source.indexOf('export const DOC_REGISTRY')
  if (start < 0) throw new Error('DOC_REGISTRY not found in registry source')
  const body = source.slice(start)
  const metas = new Map()
  const keyRe = /(?:^|\n) {2}(?:'([^']+)'|([A-Za-z0-9-]+)):\s*\{/g
  for (const match of body.matchAll(keyRe)) {
    const slug = match[1] || match[2]
    const after = (match.index ?? 0) + match[0].length
    const titleAt = body.indexOf('title:', after)
    if (titleAt < 0 || titleAt > after + 200) continue
    const titleQuote = body.indexOf("'", titleAt)
    const title = readQuoted(body, titleQuote)
    if (!title) throw new Error(`unreadable title for ${slug}`)
    const window = body.slice(title.end, title.end + 500)
    const globAt = window.indexOf('globKey:')
    const scope = globAt >= 0 ? window.slice(0, globAt) : window.slice(0, 180)
    let description = ''
    const descriptionAt = scope.indexOf('description:')
    if (descriptionAt >= 0) {
      const descriptionQuote = scope.indexOf("'", descriptionAt)
      const parsed = readQuoted(scope, descriptionQuote)
      if (!parsed) throw new Error(`unreadable description for ${slug}`)
      description = parsed.value
    }
    metas.set(slug, { title: title.value, description })
  }
  return metas
}

export function docRoutesFromRegistry(source) {
  const slugs = parseDocSlugs(source)
  const metas = parseDocMeta(source)
  return slugs.map((slug) => {
    const meta = metas.get(slug)
    if (!meta?.title) throw new Error(`registry is missing a title for doc slug ${slug}`)
    const description = meta.description.trim() || `${meta.title} in the Agentic SWE documentation.`
    return {
      path: `/docs/${slug}`,
      title: `${meta.title} · Agentic SWE`,
      description,
    }
  })
}

export function publicRoutes(source = readRegistrySource()) {
  const docs = docRoutesFromRegistry(source)
  const routes = [...MARKETING_ROUTES, ...docs]
  const seen = new Set()
  for (const route of routes) {
    if (seen.has(route.path)) throw new Error(`duplicate public route ${route.path}`)
    if (!route.title.trim() || !route.description.trim()) {
      throw new Error(`route ${route.path} is missing title or description`)
    }
    seen.add(route.path)
  }
  return routes
}

export function absoluteRouteUrl(routePath, base = viteBase(), origin = SITE_ORIGIN) {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '')
  const suffix = routePath === '/' ? '/' : `${routePath}/`
  return `${origin}${prefix}${suffix}`
}

export function parseLegacyRedirects(source) {
  const match = source.match(/export const LEGACY_MD_TO_SLUG: Record<string, DocSlug> = \{([\s\S]*?)\n\}/)
  if (!match) throw new Error('LEGACY_MD_TO_SLUG not found')
  const redirects = []
  const re = /'([^']+)':\s*'([^']+)'/g
  for (const entry of match[1].matchAll(re)) {
    redirects.push({ from: entry[1], slug: entry[2] })
  }
  return redirects
}
