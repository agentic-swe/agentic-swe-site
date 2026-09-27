import { useId, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { DOC_REGISTRY, type DocSlug } from '../docs/registry'

type HubExtraCard = { to: string; title: string; description: string }

const GROUPS: { label: string; slugs: DocSlug[]; extraCards?: HubExtraCard[] }[] = [
  {
    label: 'Get started',
    slugs: [
      'installation',
      'golden-path',
      'host-support-tiers',
      'multi-platform-support',
      'usage',
      'durable-memory',
      'claude-code-plugin',
      'troubleshooting',
      'glossary',
    ],
  },
  {
    label: 'Reference',
    slugs: [
      'check-commands',
      'catalog-routing',
      'examples',
      'subagent-catalog',
    ],
  },
  {
    label: 'Advanced capabilities',
    slugs: [
      'doubt-driven-verification',
      'cross-model-review',
      'context-packs',
      'owai-spec',
      'policy-as-code',
      'adaptive-track-router',
      'runtime-facade',
    ],
  },
  {
    label: 'Maintainers',
    slugs: ['distribution', 'release-checklist'],
  },
  {
    label: 'Product and legal',
    slugs: ['product-positioning', 'adoption-one-pager', 'licensing', 'privacy'],
    extraCards: [
      {
        to: '/support',
        title: 'Support',
        description: 'Setup, doctor, hook receipts, and where to get help.',
      },
    ],
  },
  {
    label: 'Other hosts',
    slugs: ['cursor-plugin', 'opencode', 'codex', 'antigravity'],
  },
]

/** Ordered reading path for a first run; each step links into the same registry pages. */
const BEGINNER_PATH: { to: string; title: string; note: string }[] = [
  { to: '/docs/golden-path', title: 'Golden path', note: 'First success in about 15 minutes' },
  { to: '/docs/installation', title: 'Installation guide', note: 'agentic-swe setup for your host' },
  { to: '/docs/usage', title: 'Usage', note: 'Run /work, tracks, and worklogs' },
  { to: '/docs/durable-memory', title: 'Durable memory', note: 'Automatic local memory after setup' },
  { to: '/docs/host-support-tiers', title: 'Host capabilities', note: 'What each host actually runs' },
  { to: '/docs/glossary', title: 'Glossary', note: 'Plain-language definitions' },
]

type HubEntry = {
  to: string
  title: string
  description: string
  /** Lowercased title, summary, group, and route — everything the search box matches against. */
  haystack: string
}

type HubGroup = { label: string; entries: HubEntry[] }

const HUB_GROUPS: HubGroup[] = GROUPS.map((group) => {
  const fromRegistry = group.slugs.map((slug) => {
    const meta = DOC_REGISTRY[slug]
    return {
      to: `/docs/${slug}`,
      title: meta.title,
      description: meta.description ?? '—',
      haystack: `${meta.title} ${meta.description ?? ''} ${slug} ${group.label}`.toLowerCase(),
    }
  })
  const fromExtras = (group.extraCards ?? []).map((card) => ({
    to: card.to,
    title: card.title,
    description: card.description,
    haystack: `${card.title} ${card.description} ${card.to} ${group.label}`.toLowerCase(),
  }))
  return { label: group.label, entries: [...fromRegistry, ...fromExtras] }
})

const TOTAL_PAGES = HUB_GROUPS.reduce((total, group) => total + group.entries.length, 0)

function filterGroups(query: string): HubGroup[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return HUB_GROUPS
  return HUB_GROUPS.map((group) => ({
    label: group.label,
    entries: group.entries.filter((entry) => tokens.every((token) => entry.haystack.includes(token))),
  })).filter((group) => group.entries.length > 0)
}

export function DocumentationPage() {
  const searchId = useId()
  const statusId = useId()
  const pathTitleId = useId()
  const groupIdBase = useId()
  const [query, setQuery] = useState('')

  const groups = useMemo(() => filterGroups(query), [query])
  const matchCount = useMemo(
    () => groups.reduce((total, group) => total + group.entries.length, 0),
    [groups],
  )

  const searching = query.trim().length > 0
  const status = searching
    ? `${matchCount} of ${TOTAL_PAGES} pages match “${query.trim()}”`
    : `${TOTAL_PAGES} pages across ${HUB_GROUPS.length} groups`

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && query !== '') {
      event.preventDefault()
      setQuery('')
    }
  }

  return (
    <main id="main-content" className="hub-section doc-hub">
      <p className="section-label doc-hub__eyebrow">// documentation</p>
      <h1 className="doc-hub__title">Documentation</h1>
      <p className="hub-intro">
        Every page renders the same markdown that ships in the repo. New here? Follow the beginner path. Unfamiliar
        words are in the <Link to="/docs/glossary">glossary</Link>. Search the full set below.
      </p>

      <section className="doc-hub-path" aria-labelledby={pathTitleId}>
        <h2 className="doc-hub-path__title" id={pathTitleId}>
          Beginner path
        </h2>
        <ol className="doc-hub-path__steps">
          {BEGINNER_PATH.map((step, index) => (
            <li key={step.to} className="doc-hub-path__step">
              <span className="doc-hub-path__step-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Link className="doc-hub-path__step-link" to={step.to}>
                {step.title}
              </Link>
              <span className="doc-hub-path__step-note">{step.note}</span>
            </li>
          ))}
        </ol>
      </section>

      <form className="doc-hub-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="doc-hub-search__label" htmlFor={searchId}>
          Search documentation
        </label>
        <div className="doc-hub-search__field">
          <input
            id={searchId}
            className="doc-hub-search__input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="Try “memory”, “install”, or “policy”"
            autoComplete="off"
            aria-describedby={statusId}
          />
          {searching ? (
            <button type="button" className="doc-hub-search__clear" onClick={() => setQuery('')}>
              Clear
            </button>
          ) : null}
        </div>
        <p className="doc-hub-search__status" id={statusId} role="status">
          {status}
        </p>
      </form>

      {groups.length === 0 ? (
        <p className="doc-hub__empty">
          No page matches that search.{' '}
          <button type="button" className="doc-hub__empty-reset" onClick={() => setQuery('')}>
            Show all pages
          </button>
        </p>
      ) : (
        groups.map((group, index) => (
          <section
            key={group.label}
            className="doc-hub-group"
            aria-labelledby={`${groupIdBase}-${index}`}
          >
            <h2 className="doc-hub-group-title" id={`${groupIdBase}-${index}`}>
              {group.label}
            </h2>
            <ul className="hub-grid hub-grid--two doc-hub-group__grid">
              {group.entries.map((entry) => (
                <li key={entry.to} className="doc-hub-group__item">
                  <Link className="hub-card" to={entry.to}>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  )
}
