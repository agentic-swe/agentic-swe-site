import { DOC_REGISTRY, isDocSlug } from '../docs/registry'
import { MARKETING_ROUTES, type MarketingRoute } from './marketing-routes.js'

export type PublicRoute = MarketingRoute

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname || '/'
}

export function docRoute(slug: string): PublicRoute | null {
  if (!isDocSlug(slug)) return null
  const meta = DOC_REGISTRY[slug]
  const description = meta.description?.trim() || `${meta.title} in the Agentic SWE documentation.`
  return {
    path: `/docs/${slug}`,
    title: `${meta.title} · Agentic SWE`,
    description,
  }
}

export function routeForPath(pathname: string): PublicRoute | null {
  const path = normalizePath(pathname)
  const marketing = MARKETING_ROUTES.find((route) => route.path === path)
  if (marketing) return marketing
  const docMatch = /^\/docs\/([^/]+)$/.exec(path)
  if (!docMatch) return null
  return docRoute(docMatch[1] ?? '')
}
