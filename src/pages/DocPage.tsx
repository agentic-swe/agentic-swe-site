import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DOC_REGISTRY, isDocSlug, type DocSlug } from '../docs/registry'
import { MarkdownBody } from '../docs/MarkdownBody'

/**
 * Lazy glob: each document becomes its own chunk, fetched only when its route
 * is visited, so this page does not ship the whole docs corpus up front.
 */
const rawModules = import.meta.glob<string>('../content/docs/*.md', {
  query: '?raw',
  import: 'default',
})

/**
 * Title text of the document's leading `#` heading. MarkdownBody strips that heading, so the
 * page header owns the single `h1` while keeping the wording the markdown ships with.
 */
function leadingTitle(markdown: string): string | null {
  for (const line of markdown.split('\n')) {
    if (line.trim() === '') continue
    const heading = /^#\s+(.*)$/.exec(line)
    if (!heading) return null
    const text = (heading[1] ?? '')
      .replace(/\s+#+\s*$/, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/[`*_~]/g, '')
      .trim()
    return text || null
  }
  return null
}

export function DocPage() {
  const { slug } = useParams<{ slug: string }>()
  const docSlug = slug && isDocSlug(slug) ? (slug as DocSlug) : null
  const meta = docSlug ? DOC_REGISTRY[docSlug] : null

  /** Absent loader means the slug is registered but no markdown is bundled. */
  const loader = meta ? rawModules[meta.globKey] : undefined

  const [loaded, setLoaded] = useState<{ slug: DocSlug; markdown: string } | null>(null)
  const [failedSlug, setFailedSlug] = useState<DocSlug | null>(null)

  useEffect(() => {
    if (meta) {
      document.title = `${meta.title} · Agentic SWE`
    }
    return () => {
      document.title = 'Agentic SWE — Autonomous Software Engineering Pipeline'
    }
  }, [meta])

  useEffect(() => {
    if (!loader || !docSlug) return
    let cancelled = false
    void loader()
      .then((markdown) => {
        if (!cancelled) setLoaded({ slug: docSlug, markdown })
      })
      .catch(() => {
        if (!cancelled) setFailedSlug(docSlug)
      })
    return () => {
      cancelled = true
    }
  }, [loader, docSlug])

  // Only content belonging to the slug currently in the URL may render.
  const markdown = loaded?.slug === docSlug ? loaded.markdown : undefined

  const title = useMemo(
    () => (markdown === undefined ? null : leadingTitle(markdown)),
    [markdown],
  )

  if (!slug || !docSlug || !meta) {
    return <Navigate to="/documentation" replace />
  }

  if (loader === undefined || failedSlug === docSlug) {
    return (
      <main id="main-content" className="page-main reveal visible">
        <p className="section-label">// docs</p>
        <h1>Missing document</h1>
        <p>
          No bundled content for <code>{slug}</code>.{' '}
          <Link to="/documentation">Back to documentation</Link>
        </p>
      </main>
    )
  }

  if (markdown === undefined) {
    return (
      <main id="main-content" className="route-loading" aria-busy="true" aria-live="polite">
        <span className="route-loading__signal" aria-hidden />
        Loading {meta.title}
      </main>
    )
  }

  return (
    <main id="main-content" className="page-main reveal visible doc-markdown-root doc-article">
      <header className="doc-article__header">
        <p className="section-label">// docs</p>
        <nav className="doc-breadcrumb" aria-label="Breadcrumb">
          <ol className="doc-breadcrumb__list">
            <li className="doc-breadcrumb__item">
              <Link to="/documentation">Documentation</Link>
            </li>
            <li className="doc-breadcrumb__item" aria-current="page">
              {meta.title}
            </li>
          </ol>
        </nav>
        <h1 className="doc-article__title">{title ?? meta.title}</h1>
        {meta.description ? (
          <p className="doc-article__summary">{meta.description}</p>
        ) : null}
      </header>

      <MarkdownBody markdown={markdown} stripLeadingTitle headingNav />

      <nav className="doc-see-also" aria-label="More documentation">
        <strong>More</strong> — <Link to="/documentation">All docs</Link> ·{' '}
        <Link to="/support">Support</Link>
      </nav>
    </main>
  )
}
