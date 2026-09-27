import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_ORIGIN } from '../data/project-status'
import { routeForPath } from '../seo/public-routes'

function siteBase(): string {
  const raw = import.meta.env.BASE_URL ?? '/'
  if (!raw || raw === '/') return '/'
  return raw.endsWith('/') ? raw : `${raw}/`
}

function absoluteUrl(path: string): string {
  const base = siteBase()
  const prefix = base === '/' ? '' : base.replace(/\/$/, '')
  const suffix = path === '/' ? '/' : `${path}/`
  return `${SITE_ORIGIN}${prefix}${suffix}`
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let element = document.head.querySelector(selector)
  if (!(element instanceof HTMLMetaElement)) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/** Keeps the document head aligned with the route after a client navigation. */
export function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const route = routeForPath(pathname)
    if (!route) return
    document.title = route.title
    const url = absoluteUrl(route.path)
    upsertMeta('name', 'description', route.description)
    upsertMeta('property', 'og:title', route.title)
    upsertMeta('property', 'og:description', route.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:title', route.title)
    upsertMeta('name', 'twitter:description', route.description)
    upsertMeta('name', 'twitter:url', url)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [pathname])

  return null
}
