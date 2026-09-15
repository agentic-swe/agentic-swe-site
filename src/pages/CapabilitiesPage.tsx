import { useCallback, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CapabilityModal, type CapabilityDetail } from '../components/CapabilityModal'
import { CATALOG_TOTAL } from '../data/catalog-counts'

type Card = CapabilityDetail & { body: ReactNode }

type Group = {
  id: string
  /**
   * One line symbol per group, shared by every card inside it. Text glyphs
   * rather than emoji so they inherit `currentColor` and the mono face.
   */
  symbol: string
  iconClass: 'cyan' | 'amber' | 'violet'
  title: string
  desc: string
  cards: Omit<Card, 'icon' | 'iconClass'>[]
}

const GROUPS: Group[] = [
  {
    id: 'runtime-intelligence',
    symbol: '\u25C7',
    iconClass: 'cyan',
    title: 'Runtime intelligence',
    desc: 'How the pipeline decides what to do, how much effort to spend, and who should do it.',
    cards: [
      {
        title: 'Track-aware routing',
        summary:
          'Lean, standard, and rigorous tracks share one state machine. lean-track-check records pipeline.track so phases and budgets match the risk of the change.',
        benefits: [
          'Simple fixes flow through the lean track instead of a full review cycle.',
          'Complex changes pick up design panel, code-review, and permissions-check without anyone remembering to ask.',
          'Budget ceilings are per track, so lean work cannot spend at rigorous scale.',
          'The Adaptive Track Router scores similarity against past worklogs to make routing cost-aware.',
        ],
        docSlug: 'adaptive-track-router',
        body: <>A small fix and a new subsystem do not get the same ceremony, and nobody has to choose.</>,
      },
      {
        title: 'Muscle-memory replay',
        summary:
          'Tasks are fingerprinted by files, verification command, and failure signature, then answered at the cheapest tier that holds: L0 replay at zero tokens, L1 recall, L2 assist, or L3 frontier reasoning.',
        benefits: [
          'Work you have already proven replays deterministically instead of being re-reasoned from scratch.',
          'Procedures are captured from validated work, so the source is a run that actually passed.',
          'A fail-closed eval gate blocks unevaluated procedures from autonomous use.',
          'Promotion to L0 requires two successes or explicit human approval; procedures that stop working are demoted.',
          'Token reduction is measured by the benchmark suite in the pack repository, not asserted.',
        ],
        docSlug: 'durable-memory',
        body: <>The second time a shape of work appears, the runtime replays it rather than rediscovering it.</>,
      },
      {
        title: `${CATALOG_TOTAL} specialist agents`,
        summary:
          'A catalog of domain specialists — languages, infrastructure, data and AI, quality and security — selected from signals that feasibility writes into its artifact.',
        benefits: [
          'Feasibility records a Subagent Signals section; downstream phases map those signals to agents.',
          'A core agent may spawn one subagent per phase when it hits domain depth it does not have.',
          'Model tier routing balances depth against speed per agent role.',
          'Manual invocation through /subagent stays available for work outside the pipeline.',
        ],
        docSlug: 'catalog-routing',
        body: <>Domain depth arrives because the repository asked for it, not because you remembered to.</>,
      },
      {
        title: 'Parallel design panel',
        summary:
          'On the rigorous track, architect, security, and adversarial reviewers run in parallel and their findings merge into one design-panel-review artifact.',
        benefits: [
          'Three independent perspectives cost roughly the wall-clock time of one.',
          'The security reviewer catches vulnerabilities before implementation, not at code-review.',
          'The adversarial reviewer stress-tests assumptions the architect treats as given.',
          'The Hypervisor resolves conflicts between reviewers, so one accountable decision comes out.',
        ],
        body: <>Hard designs get argued with before they get built.</>,
      },
      {
        title: 'Doubt-driven verification',
        summary:
          'A bounded adversarial protocol with a three-cycle cap, anti-theater detection, and counters enforced in CI.',
        benefits: [
          'Catches wrong directions early, while they are still cheap to change.',
          'The hard cycle cap keeps review from becoming an unbounded loop.',
          'Anti-theater detection rejects findings that cite no evidence.',
          'Available on demand through /doubt for claims outside the normal phase flow.',
        ],
        docSlug: 'doubt-driven-verification',
        body: <>Review that has to produce evidence, and has to stop.</>,
      },
    ],
  },
  {
    id: 'governance',
    symbol: '\u25A1',
    iconClass: 'amber',
    title: 'Governance',
    desc: 'What keeps the work reviewable, bounded, and attributable to a person.',
    cards: [
      {
        title: 'Human gates',
        summary:
          'The pipeline stops at ambiguity, approval, and escalation points. Gate outcomes are recorded in state.json history.',
        benefits: [
          'ambiguity-wait halts and writes an ambiguity report rather than guessing at requirements.',
          'approval-wait blocks until a real PR is approved by a person.',
          'Escalation paths surface blocked work early instead of burying it in retries.',
          'Every gate outcome is recorded with an actor — a gate is never resolved silently.',
        ],
        body: <>The pipeline runs up to the gate, never through it.</>,
      },
      {
        title: 'Receipts',
        summary:
          'The /receipt command renders a work item from .worklogs/<id>/ as markdown: transitions, cost per decision, evidence references, gates, and loop counters.',
        benefits: [
          'Every line is computed from files on disk — no model-written summary of what the model did.',
          'The output is shaped for a PR description, a Slack message, or a compliance ticket.',
          'Cost is attributed per transition, so spend maps to specific decisions.',
          'A checked-in fixture lets anyone reproduce the rendering locally.',
        ],
        body: <>A shareable, file-derived account of what was done and what it cost.</>,
      },
      {
        title: 'Hypervisor session',
        summary:
          'The primary chat session owns state.json, runs the mandatory /check steps, delegates bounded work, and stays accountable for the result.',
        benefits: [
          'One source of truth for state transitions — no hidden orchestration layer.',
          'Delegation is explicit: every spawn and return is logged in audit.log with an actor.',
          'Gate decisions and state transitions are never delegated, only bounded work is.',
          'It is a session following a policy file, not a service you have to operate.',
        ],
        body: <>One accountable session owns the state, and says so in the log.</>,
      },
      {
        title: 'Evidence standard',
        summary:
          'Phase output follows a four-point standard — observed, inferred, evidence, uncertain — so claims carry their source.',
        benefits: [
          'Removes "sounds right" conclusions; every claim names where it came from.',
          'Reviewers can see exactly what was assumed versus what was proven.',
          'The audit trail explains why a design or implementation decision was made.',
          'A consistent shape across phases lowers the cost of reading a review.',
        ],
        body: <>Claims arrive with their sources attached, and uncertainty is stated rather than hidden.</>,
      },
      {
        title: 'Policy as code',
        summary:
          'Typed org, repo, and pack policies for minimum tracks, mandatory subagents, banned tools, and budget overrides — merged deterministically and checkable in CI.',
        benefits: [
          'Organisation-level rules reach every repository without per-repo configuration.',
          'The merge order is deterministic, so it is always clear which rule won.',
          '/policy check catches malformed policy before it reaches a pipeline run.',
          'Budget overrides let a team set ceilings that match its own risk tolerance.',
        ],
        docSlug: 'policy-as-code',
        body: <>Governance you can diff, review, and enforce like any other file in the repo.</>,
      },
      {
        title: 'Cross-model verification',
        summary:
          'An optional fourth panel axis that invokes an independent model CLI under sandbox-read-only safety.',
        benefits: [
          'A second architecture reduces the blind spots a single model shares with itself.',
          'Sandbox-read-only execution prevents the external CLI from modifying the repository.',
          'Authorisation is per invocation, so you decide when it runs.',
          'Findings merge into the main review artifact instead of becoming a separate report.',
        ],
        docSlug: 'cross-model-review',
        body: <>A reviewer that does not share the first model’s assumptions.</>,
      },
    ],
  },
  {
    id: 'portability',
    symbol: '\u25B3',
    iconClass: 'violet',
    title: 'Portability',
    desc: 'Why none of this locks you to a vendor, a host, or a hosted service.',
    cards: [
      {
        title: 'No hosted runtime',
        summary:
          'The pipeline is markdown at the plugin root — phases, commands, agents, and the root policy. Your editor session, git, and CI are the runtime.',
        benefits: [
          'Nothing to deploy or operate; the workflow lives beside your code.',
          'Version control covers the whole workflow — diff, blame, and revert work on policy files.',
          'No third-party service sits between your repository and your changes.',
          'Optional local tools such as the dashboard and brainstorm server are opt-in, never required.',
        ],
        body: <>Markdown in your repository, executed by the host you already run.</>,
      },
      {
        title: 'Runs on the host you use',
        summary:
          'Claude Code is the primary path. Cursor, Codex, OpenCode, Gemini CLI, and Antigravity run the same pack through their own install route.',
        benefits: [
          'One pack, installed once per repository, rather than a per-host reimplementation.',
          'Host support tiers are documented, so you know what is first-class and what is best-effort.',
          'Switching editors does not mean rewriting the workflow.',
          'Per-host install steps are published and kept next to the pack.',
        ],
        docSlug: 'multi-platform-support',
        body: <>The same pipeline, whichever assistant your team standardised on.</>,
      },
      {
        title: 'Open work-item interchange',
        summary:
          'The OWAI spec defines L1, L2, and L3 conformance levels for work items so any tool can read, write, or enforce them.',
        benefits: [
          'Portable work items mean changing tools does not mean losing pipeline history.',
          'Conformance tiers let adopters start minimal and grow into the full spec.',
          'A conformance runner validates worklogs against the spec in CI.',
          'The format is a published standard, not an internal file layout.',
        ],
        docSlug: 'owai-spec',
        body: <>Work items are a documented interchange format, not a private file layout.</>,
      },
    ],
  },
]

export function CapabilitiesPage() {
  const [activeCard, setActiveCard] = useState<CapabilityDetail | null>(null)

  const handleClose = useCallback(() => setActiveCard(null), [])

  return (
    <main id="main-content" className="capabilities-page">
      <section className="home-section home-section--capabilities" aria-labelledby="capabilities-title">
        <header className="home-section__head">
          <p className="section-label">// capabilities</p>
          <h2 id="capabilities-title" className="home-section__title">
            What the pack actually gives you
          </h2>
          <p className="home-section__lead">
            Grouped by the question each capability answers: how the run decides, how it stays reviewable, and
            how it stays yours. Open any card for the detail behind the claim.
          </p>
        </header>

        <div className="capability-groups">
          {GROUPS.map((group) => (
            <section
              key={group.id}
              className={`capability-group capability-group--${group.id}`}
              aria-labelledby={`group-${group.id}`}
            >
              <header className="capability-group__head">
                <span className={`feature-icon ${group.iconClass}`} aria-hidden>
                  {group.symbol}
                </span>
                <h3 id={`group-${group.id}`} className="capability-group__title">
                  {group.title}
                </h3>
                <p className="capability-group__desc">{group.desc}</p>
              </header>

              <div className="features-grid">
                {group.cards.map((card) => (
                  <button
                    key={card.title}
                    type="button"
                    className="feature-card feature-card--interactive"
                    onClick={() =>
                      setActiveCard({ ...card, icon: group.symbol, iconClass: group.iconClass })
                    }
                    aria-haspopup="dialog"
                  >
                    <span className={`feature-icon ${group.iconClass}`} aria-hidden>
                      {group.symbol}
                    </span>
                    <h4>{card.title}</h4>
                    <p>{card.body}</p>
                    <span className="feature-card-hint">Open detail</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section id="platforms" className="home-section home-section--platforms" aria-labelledby="platforms-title">
        <header className="home-section__head">
          <p className="section-label">// hosts</p>
          <h2 id="platforms-title" className="home-section__title">
            Same pack, your editor or CLI
          </h2>
          <p className="home-section__lead">
            Install once into the repository; the root policy and the pipeline tree resolve the same way on every
            host. Claude Code is the primary path — see{' '}
            <Link to="/docs/multi-platform-support">multi-platform support</Link> and{' '}
            <Link to="/docs/host-support-tiers">host support tiers</Link> for what each one covers.
          </p>
        </header>

        <ul className="platforms-list">
          <li>Claude Code</li>
          <li>Cursor</li>
          <li>Codex</li>
          <li>OpenCode</li>
          <li>Gemini CLI</li>
          <li>Antigravity</li>
        </ul>
      </section>

      <CapabilityModal open={activeCard !== null} detail={activeCard} onClose={handleClose} />
    </main>
  )
}
