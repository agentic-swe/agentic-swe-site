import { isValidElement, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Components, ExtraProps } from 'react-markdown'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { resolveDocHref } from './resolveDocHref'

/** In-app routes (SPA) — use React Router instead of a plain anchor. */
function isInAppPath(to: string): boolean {
  if (!to.startsWith('/') || to.startsWith('//')) return false
  const path = to.split('#')[0]?.split('?')[0] ?? to
  return (
    path === '/' ||
    path.startsWith('/docs/') ||
    path === '/guide' ||
    path === '/support' ||
    path === '/documentation' ||
    path === '/capabilities' ||
    path === '/product'
  )
}

const Anchor: Components['a'] = ({ href, children, className, id, title }) => {
  const raw = href ?? ''
  const { to, external } = resolveDocHref(raw)
  if (external) {
    return (
      <a href={to} className={className} id={id} title={title} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  if (isInAppPath(to)) {
    return (
      <Link to={to} className={className} id={id} title={title}>
        {children}
      </Link>
    )
  }
  return (
    <a href={to} className={className} id={id} title={title}>
      {children}
    </a>
  )
}

/** Readable text for a heading: no inline code, emphasis, links, or HTML comments. */
function plainText(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** GitHub-style anchor slug, so in-document links such as `(#related)` keep resolving. */
function slugify(raw: string): string {
  return plainText(raw)
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, '')
    .trim()
    .replace(/ +/g, '-')
}

type ScannedHeading = {
  /** 1-based source line, used to match the hast node back to this entry. */
  line: number
  level: number
  text: string
  id: string
}

/** Collect ATX headings from the source, skipping anything inside fenced code. */
function scanHeadings(source: string): ScannedHeading[] {
  const lines = source.split('\n')
  const headings: ScannedHeading[] = []
  const used = new Map<string, number>()
  let openFence: string | null = null

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? ''
    const fence = /^ {0,3}(`{3,}|~{3,})/.exec(line)
    if (fence) {
      const marker = (fence[1] ?? '').charAt(0)
      if (openFence === null) openFence = marker
      else if (openFence === marker) openFence = null
      continue
    }
    if (openFence !== null) continue

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (!heading) continue
    const text = plainText((heading[2] ?? '').replace(/\s+#+\s*$/, ''))
    if (!text) continue

    const base = slugify(text) || `section-${i + 1}`
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    headings.push({
      line: i + 1,
      level: (heading[1] ?? '#').length,
      text,
      id: seen === 0 ? base : `${base}-${seen}`,
    })
  }

  return headings
}

/** Drop the document's leading `#` title so the host page can own the single `h1`. */
function withoutLeadingTitle(source: string): string {
  const lines = source.split('\n')
  let first = 0
  while (first < lines.length && (lines[first] ?? '').trim() === '') first += 1
  if (first >= lines.length || !/^#\s+/.test(lines[first] ?? '')) return source

  const rest = lines.slice(first + 1)
  while (rest.length > 0 && (rest[0] ?? '').trim() === '') rest.shift()
  return rest.join('\n')
}

function childrenText(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map((child) => childrenText(child)).join('')
  if (isValidElement<{ children?: ReactNode }>(children)) return childrenText(children.props.children)
  return ''
}

function joinClasses(...values: (string | undefined)[]): string {
  return values.filter(Boolean).join(' ')
}

type CopyState = 'idle' | 'copied' | 'failed'

const COPY_LABEL: Record<CopyState, string> = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Copy failed',
}

/** Clipboard button for fenced code; renders nothing where the Clipboard API is unavailable. */
function CopyCodeButton({ value }: { value: string }) {
  const [state, setState] = useState<CopyState>('idle')
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  if (typeof navigator === 'undefined' || !navigator.clipboard) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setState('idle'), 2000)
  }

  return (
    <button
      type="button"
      className="doc-code__copy"
      data-state={state}
      title="Copy code to clipboard"
      onClick={() => void copy()}
    >
      <span className="doc-code__copy-label" aria-live="polite">
        {COPY_LABEL[state]}
      </span>
    </button>
  )
}

function CodeBlock({ children, className }: ComponentPropsWithoutRef<'pre'> & ExtraProps) {
  const code = childrenText(children)
  return (
    <div className="doc-code">
      <pre className={className}>{children}</pre>
      {code.trim() ? <CopyCodeButton value={code} /> : null}
    </div>
  )
}

/** Wide markdown tables scroll inside a keyboard-reachable region instead of the page. */
function DataTable({ children, className }: ComponentPropsWithoutRef<'table'> & ExtraProps) {
  return (
    <div className="doc-table" role="region" aria-label="Table" tabIndex={0}>
      <table className={className}>{children}</table>
    </div>
  )
}

type HeadingProps = ComponentPropsWithoutRef<'h2'> & ExtraProps

function buildComponents(headings: ScannedHeading[], headingShift: number): Components {
  const idByLine = new Map(headings.map((heading) => [heading.line, heading.id]))

  const renderHeading = (level: number) => {
    const Heading = ({ children, className, node }: HeadingProps) => {
      const line = node?.position?.start.line
      const text = childrenText(children)
      const id = (line === undefined ? undefined : idByLine.get(line)) ?? slugify(text)
      const Tag = `h${Math.min(6, Math.max(1, level + headingShift))}` as 'h2'

      return (
        <Tag id={id || undefined} className={joinClasses('doc-heading', className)}>
          {children}
          {id ? (
            <a
              className="doc-heading__anchor"
              href={`#${id}`}
              aria-label={`Permalink to section: ${text}`}
            >
              #
            </a>
          ) : null}
        </Tag>
      )
    }
    return Heading
  }

  return {
    a: Anchor,
    h1: renderHeading(1),
    h2: renderHeading(2),
    h3: renderHeading(3),
    h4: renderHeading(4),
    h5: renderHeading(5),
    h6: renderHeading(6),
    pre: CodeBlock,
    table: DataTable,
  }
}

type TocItem = { id: string; text: string; depth: 1 | 2 }

/** Two shallowest heading levels present, as they render after `headingShift`. */
function tocItems(headings: ScannedHeading[], headingShift: number): TocItem[] {
  const rendered = headings.map((heading) => ({
    id: heading.id,
    text: heading.text,
    level: Math.min(6, Math.max(1, heading.level + headingShift)),
  }))
  if (rendered.length === 0) return []

  const top = Math.min(...rendered.map((heading) => heading.level))
  return rendered
    .filter((heading) => heading.level <= top + 1)
    .map((heading) => ({
      id: heading.id,
      text: heading.text,
      depth: heading.level === top ? 1 : 2,
    }))
}

export type MarkdownBodyProps = {
  markdown: string
  /** Render `#` as `h(1 + headingShift)` so the host page keeps exactly one `h1`. */
  headingShift?: number
  /** Drop the document's leading `#` title (page chrome renders it instead). */
  stripLeadingTitle?: boolean
  /** Render an in-page heading list derived from the document's own headings. */
  headingNav?: boolean
  navLabel?: string
}

/** Minimum headings before an in-page nav earns its space. */
const MIN_TOC_ITEMS = 3

export function MarkdownBody({
  markdown,
  headingShift = 0,
  stripLeadingTitle = false,
  headingNav = false,
  navLabel = 'On this page',
}: MarkdownBodyProps) {
  const navLabelId = useId()

  const source = useMemo(
    () => (stripLeadingTitle ? withoutLeadingTitle(markdown) : markdown),
    [markdown, stripLeadingTitle],
  )
  const headings = useMemo(() => scanHeadings(source), [source])
  const components = useMemo(() => buildComponents(headings, headingShift), [headings, headingShift])
  const toc = useMemo(
    () => (headingNav ? tocItems(headings, headingShift) : []),
    [headingNav, headings, headingShift],
  )

  return (
    <>
      {toc.length >= MIN_TOC_ITEMS ? (
        <nav className="doc-toc" aria-labelledby={navLabelId}>
          <p className="doc-toc__label" id={navLabelId}>
            {navLabel}
          </p>
          <ol className="doc-toc__list">
            {toc.map((item) => (
              <li key={item.id} className={`doc-toc__item doc-toc__item--depth-${item.depth}`}>
                <a className="doc-toc__link" href={`#${item.id}`}>
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="doc-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {source}
        </ReactMarkdown>
      </div>
    </>
  )
}
