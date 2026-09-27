import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InstallPlatformModal, type InstallPlatformId } from './InstallPlatformModal'
import { SetupButton } from './SetupButton'
import { Showreel } from './Showreel'
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
  { id: 'claude', label: 'Claude Code', hint: 'Setup CLI + plugin lifecycle' },
  { id: 'cursor', label: 'Cursor', hint: 'Setup CLI + session hooks' },
  { id: 'codex', label: 'Codex', hint: 'Setup CLI; trust hooks to run' },
  { id: 'opencode', label: 'OpenCode', hint: 'Setup CLI + chat-turn lifecycle' },
  { id: 'antigravity', label: 'Antigravity', hint: 'PreInvocation + Stop lifecycle' },
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
          <span className="hero__eyebrow-text">Open source · local workflow · no hosted service</span>
        </p>

        <h1 id="hero-title" className="hero__title">
          AI coding that leaves a record{' '}
          <span className="hero__title-accent">a person can review</span>
        </h1>

        <p className="hero__lead">
          Agentic SWE is an open-source workflow you install beside your code. It writes down what the assistant
          decided, stops for a person before that work counts as approved, and can reuse a procedure that already
          passed. There is no hosted service. Underneath, it is a local state machine with three tracks, budget
          checks, and {CATALOG_TOTAL} specialist prompts.
        </p>

        <div className="hero__actions">
          <SetupButton />
          <Link className="btn btn-ghost" to="/guide">
            How it works
          </Link>
          <Link className="btn btn-ghost" to="/evaluate">
            Who it is for
          </Link>
        </div>

        <div className="hero__reel">
          <Showreel />
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
        Pick a host to read its install notes. Windsurf, Kiro, GitHub Copilot, and generic VS Code are in the
        setup menu — Copilot is partial, and VS Code does not capture transcripts. Every native
        host runs the same local package. See the <Link to="/docs/installation">installation guide</Link>, the{' '}
        <Link to="/docs/golden-path">golden path</Link>, or <Link to="/capabilities">host boundaries</Link>.
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
