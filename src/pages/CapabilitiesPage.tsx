import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CapabilityModal, type CapabilityDetail } from '../components/CapabilityModal'
import { CATALOG_TOTAL } from '../data/catalog-counts'

type CardDef = CapabilityDetail & {
  body: React.ReactNode
}

const CARDS: CardDef[] = [
  {
    icon: '\u2699',
    iconClass: 'cyan',
    title: 'Zero runtime code',
    summary:
      'The entire pipeline is markdown at the plugin root — phases, commands, and the Hypervisor policy. The host executes it; no cloud runtime required.',
    benefits: [
      'Nothing to deploy or maintain — the pipeline lives in your repo alongside your code.',
      'Any markdown-compatible host can run the same pipeline without adapters.',
      'Version control covers the full workflow: diffs, blame, and rollback work on policy files just like source code.',
      'Optional local tools (brainstorm server, TUI dashboard) are opt-in and never required.',
    ],
    body: (
      <>
        The pipeline is markdown at the plugin root (<code style={{ fontSize: '0.85em' }}>{'${CLAUDE_PLUGIN_ROOT}/'}</code>{' '}
        — e.g. <code style={{ fontSize: '0.85em' }}>phases/</code>, <code style={{ fontSize: '0.85em' }}>commands/</code>)
        plus the root Hypervisor policy file (<code style={{ fontSize: '0.85em' }}>CLAUDE.md</code>). The host (e.g. Claude
        Code) executes it. Optional local tools like the brainstorm visual server are
        opt-in — not required to run <code style={{ fontSize: '0.85em' }}>/work</code>.
      </>
    ),
  },
  {
    icon: '\u25C6',
    iconClass: 'violet',
    title: 'Evidence-based decisions',
    summary:
      'Every phase output follows a four-point evidence standard: observed, inferred, evidence, uncertain. No guessing.',
    benefits: [
      'Eliminates "sounds right" conclusions — every claim must cite its source.',
      'Audit trail makes it easy to trace why a design or implementation decision was made.',
      'Uncertainty is explicit: reviewers see exactly what was assumed vs. proven.',
      'Consistent format across all phases reduces cognitive overhead during review.',
    ],
    body: <>Every phase output follows a four-point evidence standard: observed, inferred, evidence, uncertain. No guessing.</>,
  },
  {
    icon: '\u2605',
    iconClass: 'amber',
    title: `${CATALOG_TOTAL}+ specialized agents`,
    summary:
      'Auto-selected based on your codebase. Python, TypeScript, Rust, Kubernetes, security, ML — agents that know the domain.',
    benefits: [
      'Domain expertise is automatic: the pipeline detects languages and frameworks then selects matching specialists.',
      'Agents can delegate to other agents when they encounter sub-domain problems.',
      'Model routing (opus / sonnet / haiku) balances depth vs. speed per agent role.',
      'Manual invocation via /subagent remains available for targeted work outside the pipeline.',
    ],
    docSlug: 'catalog-routing',
    body: (
      <>
        Auto-selected based on your codebase. Python, TypeScript, Rust, Kubernetes, security, ML — agents that know the
        domain.
      </>
    ),
  },
  {
    icon: '\u26A1',
    iconClass: 'cyan',
    title: 'Human gates built in',
    summary:
      'The pipeline stops at ambiguity, approval, and escalation points. You stay in control of what ships.',
    benefits: [
      'Ambiguity-wait halts work and produces an ambiguity report rather than guessing requirements.',
      'Approval-wait blocks merging until a human explicitly approves the PR.',
      'Escalation paths surface problems early instead of burying them in iteration loops.',
      'Gate outcomes are recorded in state.json history — never silent.',
    ],
    body: <>The pipeline stops at ambiguity, approval, and escalation points. You stay in control of what ships.</>,
  },
  {
    icon: '\u2699',
    iconClass: 'violet',
    title: 'Multi-agent review',
    summary:
      'Complex designs get a three-agent panel review: architect, security, and adversarial — running in parallel.',
    benefits: [
      'Parallel execution means three independent perspectives in the time of one.',
      'The Hypervisor resolves conflicts between reviewers, so the final decision is accountable.',
      'Security reviewer catches vulnerabilities before they reach code-review.',
      'Adversarial reviewer stress-tests assumptions the architect might take for granted.',
    ],
    body: (
      <>
        Complex designs get a three-agent panel review: architect, security, and adversarial — running in parallel.
      </>
    ),
  },
  {
    icon: '\u26A1',
    iconClass: 'amber',
    title: 'Track-aware routing',
    summary:
      'Lean, standard, and rigorous tracks share one state machine. lean-track-check routes work to the right level of governance.',
    benefits: [
      'Simple fixes flow through the lean track in minutes instead of a full review cycle.',
      'Complex changes get rigorous governance (design panel, code-review, permissions-check) automatically.',
      'Budget ceilings are per-track, so lean tasks never burn rigorous-level budget.',
      'Adaptive Track Router uses similarity to past worklogs for cost-aware routing decisions.',
    ],
    docSlug: 'adaptive-track-router',
    body: (
      <>
        Lean, standard, and rigorous tracks share one state machine;{' '}
        <code style={{ fontSize: '0.85em' }}>lean-track-check</code> records{' '}
        <code style={{ fontSize: '0.85em' }}>pipeline.track</code> so phases and budgets match risk.
      </>
    ),
  },
  {
    icon: '\u25C9',
    iconClass: 'cyan',
    title: 'Hypervisor session',
    summary:
      'The primary chat session is the Hypervisor: it owns state.json, runs mandatory /check steps, delegates to agents, and stays accountable.',
    benefits: [
      'Single source of truth for state transitions — no hidden orchestration layer.',
      'Delegation is explicit: every spawn and return is logged in audit.log with actor attribution.',
      'The Hypervisor never delegates gate decisions or state transitions — only bounded work.',
      'Works in any IDE session; not a separate hosted service to configure.',
    ],
    body: (
      <>
        The primary chat session is the <strong>Hypervisor</strong>: it carries{' '}
        <code style={{ fontSize: '0.85em' }}>state.json</code>, runs mandatory{' '}
        <code style={{ fontSize: '0.85em' }}>/check</code> steps, delegates to core agents and subagents, and stays
        accountable — not a separate hosted service.
      </>
    ),
  },
  {
    icon: '\u2694',
    iconClass: 'violet',
    title: 'Cross-model verification',
    summary:
      'Fourth panel axis invoking Codex or Gemini CLIs with sandbox-read-only safety for truly independent verification.',
    benefits: [
      'Eliminates single-model blind spots by getting a second opinion from a different architecture.',
      'Sandbox-read-only safety prevents the cross-model CLI from modifying your repo.',
      'Per-invocation authorization means you control exactly when cross-model review runs.',
      'Findings are integrated into the main review artifact — not a separate report to chase.',
    ],
    docSlug: 'cross-model-review',
    body: (
      <>
        Four-axis panel review: architect, security, adversarial, and{' '}
        <strong>cross-model</strong> — invoking Codex or Gemini CLIs with sandbox-read-only safety for truly independent
        verification.
      </>
    ),
  },
  {
    icon: '\u2753',
    iconClass: 'amber',
    title: 'Doubt-Driven Verification',
    summary:
      'Bounded adversarial review protocol with a 3-cycle cap, anti-theater detection, and CI-enforced counters.',
    benefits: [
      'Catches wrong directions before they become PRs — early, not late.',
      'Hard 3-cycle cap prevents unbounded review loops while still being thorough.',
      'Anti-theater detection rejects pro-forma findings that do not cite evidence.',
      'Available on demand via /doubt for ad-hoc verification outside normal phase flow.',
    ],
    docSlug: 'doubt-driven-verification',
    body: (
      <>
        Bounded adversarial review protocol with a 3-cycle cap, anti-theater detection, and CI-enforced counters.
        Catches wrong directions before they become PRs.
      </>
    ),
  },
  {
    icon: '\u2696',
    iconClass: 'cyan',
    title: 'Policy-as-Code',
    summary:
      'Typed org and repo policies for track rules, mandatory subagents, banned tools, and budget overrides — deterministically merged and CI-enforced.',
    benefits: [
      'Org-level governance flows down to every repo without manual configuration.',
      'Deterministic merge (org > repo > pack) means no surprises about which policy wins.',
      'CI enforcement via /policy check catches malformed policies before they reach production.',
      'Budget overrides let teams set spend ceilings appropriate to their risk tolerance.',
    ],
    docSlug: 'policy-as-code',
    body: (
      <>
        Typed org and repo policies for track rules, mandatory subagents, banned tools, and budget overrides —
        deterministically merged and CI-enforced.
      </>
    ),
  },
  {
    icon: '\u2B50',
    iconClass: 'violet',
    title: 'Open interchange (OWAI)',
    summary:
      'Open Work-item Interchange spec with L1/L2/L3 conformance levels. Any tool can read, write, or enforce conformant worklogs.',
    benefits: [
      'Be the standard, not just a product — OWAI lets any tool participate in the same workflow.',
      'L1/L2/L3 conformance tiers let adopters start minimal and grow into full compliance.',
      'Built-in conformance runner validates worklogs against the spec in CI.',
      'Portable work items mean switching tools does not mean losing pipeline history.',
    ],
    docSlug: 'owai-spec',
    body: (
      <>
        Open Work-item Interchange spec with L1/L2/L3 conformance levels. Be the{' '}
        <strong>standard</strong>, not just a product — any tool can read, write, or enforce conformant worklogs.
      </>
    ),
  },
]

export function CapabilitiesPage() {
  const [activeCard, setActiveCard] = useState<CardDef | null>(null)

  const handleClose = useCallback(() => setActiveCard(null), [])

  return (
    <>
      <section id="overview">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <div className="section-label">// capabilities</div>
          <h2>What makes it different</h2>
        </motion.div>
        <div className="features-grid">
          {CARDS.map((card, i) => (
            <motion.button
              key={card.title}
              type="button"
              className="feature-card feature-card--interactive"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4, borderColor: 'var(--cyan-dim)' }}
              onClick={() => setActiveCard(card)}
              aria-haspopup="dialog"
            >
              <div className={`feature-icon ${card.iconClass}`}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <span className="feature-card-hint">Click to learn more</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section id="platforms">
        <motion.div
          className="platforms-section"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="section-label">// multi-platform</div>
          <h2>Same pack, your editor or CLI</h2>
          <p
            className="section-desc"
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '720px' }}
          >
            Install once into the repo; the <strong>Hypervisor</strong> policy and{' '}
            <code style={{ fontSize: '0.9em' }}>{'${CLAUDE_PLUGIN_ROOT}/'}</code> pipeline tree work across hosts.{' '}
            <strong>Claude Code</strong> is
            the primary path; Cursor, Codex, OpenCode, and Gemini CLI are supported via the bundled plugin / extension
            hooks — see <Link to="/docs/multi-platform-support">multi-platform support</Link>.
          </p>
          <div className="platforms-list">
            <span>Claude Code</span>
            <span>Cursor</span>
            <span>Codex</span>
            <span>OpenCode</span>
            <span>Gemini CLI</span>
          </div>
        </motion.div>
      </section>

      <CapabilityModal open={activeCard !== null} detail={activeCard} onClose={handleClose} />
    </>
  )
}
