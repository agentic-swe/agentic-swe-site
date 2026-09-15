import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MarkdownBody } from '../docs/MarkdownBody'

const TAB_IDS = ['overview', 'claude', 'cursor', 'codex', 'opencode', 'antigravity'] as const

type InstallGuideTabId = (typeof TAB_IDS)[number]

const TAB_LABELS: Record<InstallGuideTabId, string> = {
  overview: 'Overview',
  claude: 'Claude Code',
  cursor: 'Cursor',
  codex: 'Codex',
  opencode: 'OpenCode',
  antigravity: 'Antigravity',
}

const TAB_PATH: Record<InstallGuideTabId, string> = {
  overview: '../content/docs/install-guide/overview.md',
  claude: '../content/docs/install-guide/claude.md',
  cursor: '../content/docs/install-guide/cursor.md',
  codex: '../content/docs/install-guide/codex.md',
  opencode: '../content/docs/install-guide/opencode.md',
  antigravity: '../content/docs/install-guide/antigravity.md',
}

const rawInstallGuide = import.meta.glob<string>('../content/docs/install-guide/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** Tab named by the URL hash, or null when the hash targets something else (e.g. a heading). */
function tabFromHash(hash: string): InstallGuideTabId | null {
  const h = hash.replace(/^#/, '').toLowerCase()
  if ((TAB_IDS as readonly string[]).includes(h)) {
    return h as InstallGuideTabId
  }
  return null
}

function markdownForTab(tab: InstallGuideTabId): string {
  const key = TAB_PATH[tab]
  const body = rawInstallGuide[key]
  if (typeof body !== 'string') {
    throw new Error(`Missing install guide markdown: ${key}`)
  }
  return body
}

export function InstallationGuidePage() {
  const location = useLocation()
  const navigate = useNavigate()

  const hashTab = tabFromHash(location.hash)
  // The URL leads; the last explicit choice keeps the panel steady when the hash targets a heading.
  const [lastSelected, setLastSelected] = useState<InstallGuideTabId>(hashTab ?? 'overview')
  const activeTab = hashTab ?? lastSelected
  const tabRefs = useRef<Partial<Record<InstallGuideTabId, HTMLButtonElement | null>>>({})

  useEffect(() => {
    document.title = 'Installation Guide · Agentic SWE'
    return () => {
      document.title = 'Agentic SWE — Autonomous Software Engineering Pipeline'
    }
  }, [])

  const selectTab = useCallback(
    (id: InstallGuideTabId) => {
      setLastSelected(id)
      navigate({ pathname: '/docs/installation', hash: id }, { replace: true })
    },
    [navigate],
  )

  /** Roving tabindex per WAI-ARIA tabs: arrows move and activate, Home/End jump to the ends. */
  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = TAB_IDS.indexOf(activeTab)
    let nextIndex: number
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (current + 1) % TAB_IDS.length
        break
      case 'ArrowLeft':
        nextIndex = (current - 1 + TAB_IDS.length) % TAB_IDS.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = TAB_IDS.length - 1
        break
      default:
        return
    }

    const nextId = TAB_IDS[nextIndex]
    if (!nextId) return
    event.preventDefault()
    selectTab(nextId)
    tabRefs.current[nextId]?.focus()
  }

  const markdown = useMemo(() => markdownForTab(activeTab), [activeTab])

  return (
    <main id="main-content" className="page-main reveal visible doc-markdown-root install-guide-page">
      <header className="doc-article__header">
        <p className="section-label">// docs</p>
        <nav className="doc-breadcrumb" aria-label="Breadcrumb">
          <ol className="doc-breadcrumb__list">
            <li className="doc-breadcrumb__item">
              <Link to="/documentation">Documentation</Link>
            </li>
            <li className="doc-breadcrumb__item" aria-current="page">
              Installation Guide
            </li>
          </ol>
        </nav>
        <h1 className="doc-article__title">Installation Guide</h1>
        <p className="install-guide-intro">
          Prerequisites, migration, and uninstall are under <strong>Overview</strong>. Pick a runtime for full install
          steps, layout notes, and links to Usage and troubleshooting.
        </p>
      </header>

      <div className="install-guide-tabs-wrap">
        <div
          className="install-guide-tabs"
          role="tablist"
          aria-label="Installation by runtime"
          aria-orientation="horizontal"
          onKeyDown={onTabKeyDown}
        >
          {TAB_IDS.map((id) => {
            const selected = activeTab === id
            return (
              <button
                key={id}
                ref={(node) => {
                  tabRefs.current[id] = node
                }}
                type="button"
                role="tab"
                id={`install-tab-${id}`}
                aria-selected={selected}
                aria-controls={`install-panel-${id}`}
                tabIndex={selected ? 0 : -1}
                className={`install-guide-tab${selected ? ' install-guide-tab--active' : ''}`}
                onClick={() => selectTab(id)}
              >
                {TAB_LABELS[id]}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="install-guide-panel"
        role="tabpanel"
        id={`install-panel-${activeTab}`}
        aria-labelledby={`install-tab-${activeTab}`}
      >
        <h2 className="install-guide-panel__title">{TAB_LABELS[activeTab]}</h2>
        <MarkdownBody key={activeTab} markdown={markdown} stripLeadingTitle headingShift={1} />
      </div>

      <nav className="doc-see-also" aria-label="More documentation">
        <strong>More</strong> — <Link to="/documentation">All docs</Link> ·{' '}
        <Link to="/support">Support</Link>
      </nav>
    </main>
  )
}
