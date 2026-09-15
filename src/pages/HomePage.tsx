import { Link } from 'react-router-dom'
import { Hero, InstallPlatforms } from '../components/Hero'
import { PipelineViz } from '../components/PipelineViz'
import { CATALOG_COUNTS, CATALOG_TOTAL } from '../data/catalog-counts'

/**
 * Sample receipt values come from the checked-in fixture
 * `test/fixtures/receipt/lean-happy/` in the agentic-swe repository, so the
 * numbers on this page are reproducible rather than illustrative.
 */
const RECEIPT_META: ReadonlyArray<readonly [string, string]> = [
  ['Work ID', 'add-retry-logic'],
  ['Track', 'lean'],
  ['Status', 'completed'],
  ['Duration', '47 min'],
  ['Cost', '$1.84'],
  ['PR', 'example/repo#142'],
]

const RECEIPT_DECISIONS: ReadonlyArray<{ edge: string; cost: string; evidence: string }> = [
  { edge: 'feasibility → lean-track-check', cost: '$0.08', evidence: 'lean signal → feasibility.md#L1-L20' },
  { edge: 'lean-track-check → lean-track-implementation', cost: '$0.04', evidence: 'verdict: simple' },
  { edge: 'lean-track-implementation → validation', cost: '$1.33', evidence: 'implementation complete → implementation.md' },
  { edge: 'validation → pr-creation', cost: '$0.21', evidence: 'tests green' },
  { edge: 'pr-creation → approval-wait', cost: '$0.18', evidence: 'PR opened' },
  { edge: 'approval-wait → completed', cost: '$0.00', evidence: 'approved by a human reviewer' },
]

const LADDER: ReadonlyArray<{
  tier: string
  name: string
  cost: string
  desc: string
}> = [
  {
    tier: 'L0',
    name: 'Reflex',
    cost: '0 tokens',
    desc: 'Replay a recorded procedure, the repo map, an engine transition, or the lint and test oracle. No model call at all.',
  },
  {
    tier: 'L1',
    name: 'Recall',
    cost: '~1.5K tokens',
    desc: 'A procedure matches closely enough to verify rather than re-derive. Memory supplies the context.',
  },
  {
    tier: 'L2',
    name: 'Assist',
    cost: '~8K tokens',
    desc: 'Memory-guided verification and repo-map test selection narrow the work before the model sees it.',
  },
  {
    tier: 'L3',
    name: 'Deliberate',
    cost: '~200K tokens',
    desc: 'The frontier model reasons from scratch. This is the tier every new problem starts on.',
  },
]

const GOVERNANCE: ReadonlyArray<{
  title: string
  items: ReadonlyArray<{ term: string; desc: string }>
}> = [
  {
    title: 'Gates',
    items: [
      { term: 'ambiguity-wait', desc: 'The task is underspecified. Work stops and an ambiguity report is written instead of a guess.' },
      { term: 'approval-wait', desc: 'A real PR exists. The pipeline holds until a person approves it.' },
      { term: 'escalate-code · escalate-validation', desc: 'A loop is exhausted or the environment is blocked. The problem surfaces instead of repeating.' },
    ],
  },
  {
    title: 'Enforcement',
    items: [
      { term: '/check budget', desc: 'Runs before each phase. Caps are per track, so lean work cannot spend at rigorous scale.' },
      { term: '/check transition', desc: 'Runs before each state change. The edge must be legal for the active track.' },
      { term: '/check artifacts', desc: 'Runs after a phase writes. Required files must exist before the state moves.' },
    ],
  },
  {
    title: 'Record',
    items: [
      { term: 'state.json', desc: 'Current state, track, budgets, loop counters, and transition history with actor and reason.' },
      { term: 'audit.log', desc: 'Append-only trail of every delegation and gate outcome.' },
      { term: 'progress.md', desc: 'Human-readable timeline with a context summary every third transition.' },
    ],
  },
]

const COMMANDS: ReadonlyArray<readonly [string, string]> = [
  ['/work <task|id>', 'Start a work item or resume one from its files'],
  ['/goal <objective>', 'Governed outer loop that plans and schedules work items up to the gate'],
  ['/receipt', 'Render the shareable audit summary for a finished work item'],
  ['/check budget | transition | artifacts', 'The three enforcement steps the pipeline cannot skip'],
  ['/doubt <claim>', 'Bounded adversarial verification, capped at three cycles'],
  ['/subagent', 'Browse or directly invoke a catalog specialist'],
  ['/plan-only <task>', 'Feasibility and design with no implementation branch'],
  ['/policy show | check', 'Inspect the merged policy or validate this repository against it'],
]

export function HomePage() {
  return (
    <main id="main-content">
      <Hero />

      <section id="receipt" className="home-section home-section--receipt" aria-labelledby="receipt-title">
        <header className="home-section__head">
          <p className="section-label">// the outcome</p>
          <h2 id="receipt-title" className="home-section__title">
            You review a receipt, not a transcript
          </h2>
          <p className="home-section__lead">
            When a work item finishes, <code>/receipt</code> reads <code>.worklogs/&lt;id&gt;/</code> and renders
            what happened: which transitions were taken, what each one cost, which evidence backed it, and who
            approved the merge. It is computed from files on disk — not summarised by a model.
          </p>
        </header>

        <figure className="receipt">
          <div className="receipt__frame">
            <p className="receipt__title">/work add-retry-logic — Add retry logic to the API client</p>

            <dl className="receipt__meta">
              {RECEIPT_META.map(([term, value]) => (
                <div key={term} className="receipt__meta-row">
                  <dt className="receipt__meta-term">{term}</dt>
                  <dd className="receipt__meta-value">{value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="receipt__subhead">Decisions made ({RECEIPT_DECISIONS.length})</h3>
            <ol className="receipt__decisions">
              {RECEIPT_DECISIONS.map((decision) => (
                <li key={decision.edge} className="receipt__decision">
                  <span className="receipt__decision-edge">{decision.edge}</span>
                  <span className="receipt__decision-cost">{decision.cost}</span>
                  <span className="receipt__decision-evidence">{decision.evidence}</span>
                </li>
              ))}
            </ol>

            <h3 className="receipt__subhead">Human gates respected (1)</h3>
            <ul className="receipt__gates">
              <li className="receipt__gate">
                <code>approval-wait</code> resolved by a human reviewer before the merge
              </li>
            </ul>
          </div>
          <figcaption className="receipt__caption">
            Values above are the checked-in fixture <code>test/fixtures/receipt/lean-happy/</code>. Reproduce it
            with <code>node scripts/render-receipt.cjs --work-dir test/fixtures/receipt/lean-happy</code>.
          </figcaption>
        </figure>
      </section>

      <section id="topology" className="home-section home-section--topology" aria-labelledby="topology-title">
        <header className="home-section__head">
          <p className="section-label">// topology</p>
          <h2 id="topology-title" className="home-section__title">
            One state machine, three levels of ceremony
          </h2>
          <p className="home-section__lead">
            After feasibility, <code>lean-track-check</code> writes <code>pipeline.track</code> into{' '}
            <code>state.json</code>. The active track decides which transitions are legal, which artifacts are
            required, and how much budget the work may spend.
          </p>
        </header>

        <PipelineViz />
      </section>

      <section id="memory" className="home-section home-section--memory" aria-labelledby="memory-title">
        <header className="home-section__head">
          <p className="section-label">// muscle memory</p>
          <h2 id="memory-title" className="home-section__title">
            A ladder that descends toward zero tokens
          </h2>
          <p className="home-section__lead">
            Frontier reasoning is expensive and repetitive. Agentic SWE fingerprints a task by its files, its
            verification command, and its failure signature, then answers at the cheapest tier that can handle
            it — falling back up the ladder when the cheap answer does not hold.
          </p>
        </header>

        <ol className="ladder">
          {LADDER.map((level) => (
            <li key={level.tier} className={`ladder__level ladder__level--${level.tier.toLowerCase()}`}>
              <p className="ladder__tier">{level.tier}</p>
              <h3 className="ladder__name">{level.name}</h3>
              <p className="ladder__cost">{level.cost}</p>
              <p className="ladder__desc">{level.desc}</p>
            </li>
          ))}
        </ol>

        <p className="ladder__note">
          Procedures are captured from validated work and must pass a golden eval before they can be used;
          unevaluated procedures are never replayed. Promotion from L1 to L0 requires two successes or explicit
          human approval, and a procedure that stops working is demoted. Details:{' '}
          <Link to="/docs/durable-memory">durable memory</Link>.
        </p>
      </section>

      <section id="governance" className="home-section home-section--governance" aria-labelledby="governance-title">
        <header className="home-section__head">
          <p className="section-label">// governance</p>
          <h2 id="governance-title" className="home-section__title">
            Nothing ships without a person
          </h2>
          <p className="home-section__lead">
            The primary session is the Hypervisor: it owns <code>state.json</code>, runs the enforcement steps,
            and delegates bounded work to agents. It never delegates a gate decision or a state transition.
          </p>
        </header>

        <div className="governance">
          {GOVERNANCE.map((group) => (
            <section key={group.title} className="governance__group" aria-labelledby={`governance-${group.title.toLowerCase()}`}>
              <h3 id={`governance-${group.title.toLowerCase()}`} className="governance__group-title">
                {group.title}
              </h3>
              <dl className="governance__list">
                {group.items.map((item) => (
                  <div key={item.term} className="governance__item">
                    <dt className="governance__term">{item.term}</dt>
                    <dd className="governance__desc">{item.desc}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <section id="agents" className="home-section home-section--agents" aria-labelledby="agents-title">
        <header className="home-section__head">
          <p className="section-label">// specialists</p>
          <h2 id="agents-title" className="home-section__title">
            {CATALOG_TOTAL} specialists, selected from repo signals
          </h2>
          <p className="home-section__lead">
            Feasibility writes a Subagent Signals section into its artifact; later phases map those signals to
            agents in the catalog. You can also call any of them directly with <code>/subagent invoke</code>.
          </p>
        </header>

        <div className="constellation">
          <p className="constellation__total">
            <span className="constellation__total-value">{CATALOG_TOTAL}</span>
            <span className="constellation__total-label">
              agents across {CATALOG_COUNTS.categories.length} categories
            </span>
          </p>
          <ul className="constellation__list">
            {CATALOG_COUNTS.categories.map((category) => (
              <li key={category.slug} className="constellation__item">
                <span className="constellation__label">{category.label}</span>
                <span className="constellation__count">{category.count}</span>
              </li>
            ))}
          </ul>
          <p className="constellation__note">
            Counts are generated from <code>agents/subagents/</code> in the pack, not maintained by hand. See{' '}
            <Link to="/docs/subagent-catalog">the catalog</Link> and{' '}
            <Link to="/docs/catalog-routing">how routing picks one</Link>.
          </p>
        </div>
      </section>

      <section id="commands" className="home-section home-section--commands" aria-labelledby="commands-title">
        <header className="home-section__head">
          <p className="section-label">// interaction</p>
          <h2 id="commands-title" className="home-section__title">
            The whole surface is a handful of commands
          </h2>
          <p className="home-section__lead">
            You drive the pipeline in the chat you already use. These are the ones worth memorising; the rest
            are listed in <Link to="/docs/usage">usage</Link>.
          </p>
        </header>

        <dl className="command-list">
          {COMMANDS.map(([name, desc]) => (
            <div key={name} className="command">
              <dt className="command__name">{name}</dt>
              <dd className="command__desc">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="install" className="home-section home-section--install" aria-labelledby="install-title">
        <header className="home-section__head">
          <p className="section-label">// install</p>
          <h2 id="install-title" className="home-section__title">
            Install once, where you already work
          </h2>
          <p className="home-section__lead">
            Agentic SWE is markdown that lives in your repository — policies, phases, commands, and agents. There
            is no service to provision and no code to run in production. Claude Code is the primary host; the
            same pack works elsewhere.
          </p>
        </header>

        <InstallPlatforms />
      </section>
    </main>
  )
}
