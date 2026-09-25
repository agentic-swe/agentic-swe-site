import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InstallPlatformModal, type InstallPlatformId } from './InstallPlatformModal'
import { HeroMedia } from './HeroMedia'
import { SetupButton } from './SetupButton'
import { CATALOG_TOTAL } from '../data/catalog-counts'

const INSTALL_DOC_PATHS: Record<InstallPlatformId, string> = {
  claude: '../content/docs/claude-code-plugin.md',
  cursor: '../content/docs/cursor-plugin.md',
  codex: '../content/docs/README.codex.md',
  opencode: '../content/docs/README.opencode.md',
  antigravity: '../content/docs/antigravity.md',
}

const rawInstallDocs = import.meta.glob<string>(
  [
    '../content/docs/claude-code-plugin.md',
    '../content/docs/cursor-plugin.md',
    '../content/docs/README.codex.md',
    '../content/docs/README.opencode.md',
    '../content/docs/antigravity.md',
  ],
  { query: '?raw', import: 'default', eager: true },
)

const PLATFORMS: { id: InstallPlatformId; label: string; hint: string }[] = [
  { id: 'claude', label: 'Claude Code', hint: 'Plugin marketplace — primary path' },
  { id: 'cursor', label: 'Cursor', hint: 'Install script + policy merge' },
  { id: 'codex', label: 'Codex', hint: 'AGENTS.md + symlinked pack' },
  { id: 'opencode', label: 'OpenCode', hint: '.opencode plugin directory' },
  { id: 'antigravity', label: 'Antigravity', hint: 'Google IDE, same markdown pack' },
]

function installMarkdown(id: InstallPlatformId): string {
  const path = INSTALL_DOC_PATHS[id]
  const raw = rawInstallDocs[path]
  if (typeof raw !== 'string') {
    throw new Error(`Missing install doc bundle for ${path}`)
  }
  return raw
}

/**
 * Outcome-first hero. Actions are navigational only: the platform picker lives
 * further down the page in the `#install` section.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-dot" aria-hidden />
          Markdown pack · runs in your editor · no hosted runtime
        </p>

        <h1 id="hero-title" className="hero__title">
          Engineering intelligence that{' '}
          <span className="hero__title-accent">remembers how to ship</span>
        </h1>

        <p className="hero__lead">
          Agentic SWE turns AI coding from a chat transcript into a governed pipeline. Every decision is
          written into your repository as an artifact, every merge waits on a human, and validated work is
          distilled into procedures the runtime can replay instead of re-reasoning.
        </p>

        <div className="hero__actions">
          <SetupButton />
          <Link className="btn btn-ghost" to="/guide">
            How it works
          </Link>
        </div>

        <ul className="hero__proof">
          <li className="hero__proof-item">
            <span className="hero__proof-value">{CATALOG_TOTAL}</span>
            <span className="hero__proof-label">specialist agents in the catalog</span>
          </li>
          <li className="hero__proof-item">
            <span className="hero__proof-value">3</span>
            <span className="hero__proof-label">tracks over one state machine</span>
          </li>
          <li className="hero__proof-item">
            <span className="hero__proof-value">L0</span>
            <span className="hero__proof-label">replay tier for proven procedures</span>
          </li>
        </ul>
      </div>

      <HeroMedia />
    </section>
  )
}

/**
 * Platform picker + install instructions modal. Rendered below the first
 * viewport by `HomePage`; also safe to reuse on other marketing pages.
 */
export function InstallPlatforms() {
  const [modalId, setModalId] = useState<InstallPlatformId | null>(null)

  const close = useCallback(() => setModalId(null), [])

  const modalTitle = useMemo(() => {
    if (!modalId) return ''
    const platform = PLATFORMS.find((p) => p.id === modalId)
    return platform ? `Install · ${platform.label}` : ''
  }, [modalId])

  const modalMarkdown = useMemo(() => (modalId ? installMarkdown(modalId) : ''), [modalId])

  return (
    <div className="install-picker">
      <ul className="install-picker__grid">
        {PLATFORMS.map((platform) => (
          <li key={platform.id} className="install-picker__cell">
            <button
              type="button"
              className="install-picker__tile"
              onClick={() => setModalId(platform.id)}
              aria-haspopup="dialog"
            >
              <span className="install-picker__name">{platform.label}</span>
              <span className="install-picker__hint">{platform.hint}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="install-picker__note">
        Pick a host to read its exact steps. Every host runs the same markdown pack — see the{' '}
        <Link to="/docs/installation">full installation guide</Link> or the{' '}
        <Link to="/docs/golden-path">golden path</Link> for a ~15 minute first run.
      </p>

      <InstallPlatformModal
        open={modalId !== null}
        title={modalTitle}
        markdown={modalMarkdown}
        onClose={close}
      />
    </div>
  )
}
