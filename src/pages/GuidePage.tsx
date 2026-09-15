import { Link } from 'react-router-dom'
import { CATALOG_TOTAL } from '../data/catalog-counts'

const LAYERS: ReadonlyArray<{ name: string; role: string; where: string }> = [
  {
    name: 'Root policy',
    role: 'The operating rules the primary session follows: the transition graph, budget caps, gate definitions, and the enforcement steps that cannot be skipped.',
    where: 'CLAUDE.md in your repository root',
  },
  {
    name: 'Hypervisor session',
    role: 'The chat you are already in. It owns state, chooses the next legal edge, runs the checks, delegates bounded work, and stays accountable for the result.',
    where: 'Your editor or CLI session',
  },
  {
    name: 'Phases and commands',
    role: 'One markdown file per pipeline state and per slash command. The session reads the file for the current state and does what it says.',
    where: 'phases/ and commands/ in the pack',
  },
  {
    name: 'Agents',
    role: `Three core agents — developer, git-operations, pr-manager — plus ${CATALOG_TOTAL} catalog specialists, all markdown prompts invoked for bounded work.`,
    where: 'agents/ and agents/subagents/ in the pack',
  },
  {
    name: 'Work state',
    role: 'Everything a run produces, written to disk so the work can be resumed, audited, replayed, or rendered as a receipt.',
    where: '.worklogs/<id>/ in your repository',
  },
]

const TRACK_ROWS: ReadonlyArray<{ track: string; verdict: string; shape: string }> = [
  {
    track: 'lean',
    verdict: 'simple',
    shape: 'lean-track-implementation → validation → pr-creation → approval-wait',
  },
  {
    track: 'standard',
    verdict: 'standard',
    shape: 'design → verification → test-strategy → implementation → self-review → validation → pr-creation → approval-wait',
  },
  {
    track: 'rigorous',
    verdict: 'complex',
    shape: 'adds design-review, code-review, and permissions-check around the standard shape',
  },
]

export function GuidePage() {
  return (
    <main id="main-content" className="page-main reveal visible guide-page">
      <p className="section-label">// how it works</p>
      <h1>How it works</h1>
      <p className="guide-lede">
        Agentic SWE is a finite state machine written in markdown. Your assistant session reads the policy,
        moves through explicit states, writes an artifact at every step, and stops at the points where a person
        should decide. This page is the short version; each section links to the reference behind it.
      </p>

      <nav className="guide-toc" aria-label="On this page">
        <strong>On this page</strong>
        <ul>
          <li>
            <a href="#architecture">Architecture</a>
          </li>
          <li>
            <a href="#install">Install and first run</a>
          </li>
          <li>
            <a href="#pipeline">The loop</a>
          </li>
          <li>
            <a href="#gates">Gates and budgets</a>
          </li>
          <li>
            <a href="#memory">Memory and replay</a>
          </li>
          <li>
            <a href="#commands">Commands</a>
          </li>
          <li>
            <a href="#agents">Agents</a>
          </li>
          <li>
            <a href="#platforms">Platforms</a>
          </li>
          <li>
            <a href="#examples">Examples</a>
          </li>
        </ul>
      </nav>

      <h2 id="architecture">Architecture</h2>
      <p>
        There are five moving parts and no server. Everything below ships as files, either in the installed pack
        or in your own repository.
      </p>
      <dl className="guide-architecture">
        {LAYERS.map((layer) => (
          <div key={layer.name} className="guide-architecture__layer">
            <dt className="guide-architecture__name">{layer.name}</dt>
            <dd className="guide-architecture__role">
              {layer.role}
              <span className="guide-architecture__where">{layer.where}</span>
            </dd>
          </div>
        ))}
      </dl>

      <h2 id="install">Install and first run</h2>
      <p>
        Install the pack globally, then point your host at it. In Claude Code you can instead add the plugin
        marketplace; other hosts have their own one-line route.
      </p>
      <pre>
        {`npm install -g @agentic-swe/agentic-swe
claude --plugin-dir "$(agentic-swe path)"`}
      </pre>
      <p>
        In your target repository, run <code>/install</code> once. It merges the policy block into{' '}
        <code>CLAUDE.md</code> and sets up <code>.worklogs/</code> with an optional{' '}
        <code>.gitignore</code> entry. Then start work:
      </p>
      <pre>{`/work Add retry logic to the API client`}</pre>
      <p>
        When the run reaches <code>approval-wait</code>, review the PR. After it merges, run{' '}
        <code>/receipt</code> for the shareable summary. Full detail:{' '}
        <Link to="/docs/installation">installation guide</Link> ·{' '}
        <Link to="/docs/golden-path">golden path</Link> (about fifteen minutes).
      </p>

      <h2 id="pipeline">The loop</h2>
      <p>Every iteration the Hypervisor does the same five things:</p>
      <ol className="guide-loop">
        <li>
          Read <code>current_state</code> and <code>pipeline.track</code> from <code>state.json</code>.
        </li>
        <li>
          Run <code>/check budget</code>, pick an allowed edge, run <code>/check transition</code>.
        </li>
        <li>
          Execute <code>phases/&lt;state&gt;.md</code>, write its artifacts, run <code>/check artifacts</code>.
        </li>
        <li>
          Update <code>state.json</code>, <code>progress.md</code>, and <code>audit.log</code> with the actor,
          reason, and evidence for the transition.
        </li>
        <li>Repeat until a gate, an escalation, or <code>completed</code>.</li>
      </ol>
      <p>
        After <code>feasibility</code>, the <code>lean-track-check</code> phase writes{' '}
        <code>pipeline.track</code>, and that value decides which edges are legal for the rest of the run.
      </p>
      <table>
        <thead>
          <tr>
            <th>Track</th>
            <th>Feasibility verdict</th>
            <th>Shape, abbreviated</th>
          </tr>
        </thead>
        <tbody>
          {TRACK_ROWS.map((row) => (
            <tr key={row.track}>
              <td>
                <strong>{row.track}</strong>
              </td>
              <td>
                <code>{row.verdict}</code>
              </td>
              <td>{row.shape}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        The canonical edges live in <code>state-machine.json</code> and in the fenced graph in the root policy;
        CI checks that the two agree. If <code>pipeline.track</code> is missing on older work, treat it as{' '}
        <strong>rigorous</strong>.
      </p>

      <h2 id="gates">Gates and budgets</h2>
      <p>
        The pipeline runs <em>up to</em> a gate, never through it. <code>ambiguity-wait</code> halts when the
        task is underspecified and writes an ambiguity report instead of guessing.{' '}
        <code>approval-wait</code> holds until a real PR is approved by a person.{' '}
        <code>escalate-code</code> and <code>escalate-validation</code> surface exhausted loops or a blocked
        environment. Every outcome is recorded in <code>state.json</code> history with an actor.
      </p>
      <p>
        Budgets are per track and enforced before each phase. Review loops carry counters — lean review, design
        review, implementation against code review, self-review, approval rejections, merge conflicts — and the
        same failure twice escalates rather than burning the remaining budget. Rejections append to{' '}
        <code>reflection-log.md</code>, which the receiving phase must read. Reference:{' '}
        <Link to="/docs/check-commands">check commands</Link> ·{' '}
        <Link to="/docs/policy-as-code">policy as code</Link>.
      </p>

      <h2 id="memory">Memory and replay</h2>
      <p>
        A task is fingerprinted by the files it touches, its verification command, and its failure signature.
        The runtime then answers at the cheapest tier that holds: <strong>L0</strong> replays a recorded
        procedure with no model call, <strong>L1</strong> verifies a close procedure match,{' '}
        <strong>L2</strong> uses memory-guided verification and repo-map test selection, and{' '}
        <strong>L3</strong> is full frontier reasoning. New problems start at L3.
      </p>
      <p>
        Procedures are captured from validated runs and must pass a golden evaluation before they can be used —
        unevaluated procedures are never replayed. Promotion from L1 to L0 requires two successes or an explicit
        human approval, and a procedure that stops working is demoted. Reference:{' '}
        <Link to="/docs/durable-memory">durable memory</Link> ·{' '}
        <Link to="/docs/context-packs">context packs</Link>.
      </p>

      <h2 id="commands">Commands</h2>
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>/work</code>
            </td>
            <td>Start a work item or resume one by id</td>
          </tr>
          <tr>
            <td>
              <code>/goal</code>
            </td>
            <td>Governed outer loop over an objective, stopping at the same gates</td>
          </tr>
          <tr>
            <td>
              <code>/plan-only</code> · <code>/write-plan</code> · <code>/execute-plan</code>
            </td>
            <td>Plan without implementing, refine the plan, then run it</td>
          </tr>
          <tr>
            <td>
              <code>/check budget</code> · <code>/check transition</code> · <code>/check artifacts</code>
            </td>
            <td>The three enforcement steps around every phase and transition</td>
          </tr>
          <tr>
            <td>
              <code>/receipt</code>
            </td>
            <td>Render the work item as a shareable audit summary</td>
          </tr>
          <tr>
            <td>
              <code>/doubt</code> · <code>/policy</code>
            </td>
            <td>Bounded adversarial verification; inspect or validate merged policy</td>
          </tr>
          <tr>
            <td>
              <code>/repo-scan</code> · <code>/test-runner</code> · <code>/lint</code>
            </td>
            <td>Evidence helpers the phases call when they need facts</td>
          </tr>
          <tr>
            <td>
              <code>/subagent</code>
            </td>
            <td>Browse or invoke a catalog specialist directly</td>
          </tr>
        </tbody>
      </table>
      <p>
        Full list with arguments: <Link to="/docs/usage">usage</Link>.
      </p>

      <h2 id="agents">Agents</h2>
      <p>
        Agents are markdown prompts. The Hypervisor delegates bounded work to them and remains accountable for
        state, transitions, and synthesis. Three core agents cover implementation, git operations, and pull
        requests. On the rigorous track a design panel — architect, security, adversarial — runs in parallel and
        merges into one review artifact, with the Hypervisor resolving conflicts.
      </p>
      <h3 id="subagent-selection">Subagent selection</h3>
      <p>
        Feasibility writes a <strong>Subagent Signals</strong> section into its artifact; later phases map those
        signals onto the {CATALOG_TOTAL}-agent catalog. A core agent may spawn at most one subagent per phase
        when it needs domain depth, and every spawn and return is logged in <code>audit.log</code>. When
        remaining budget is low, auto-selection may be skipped; <code>/subagent invoke</code> always works
        manually. Reference: <Link to="/docs/catalog-routing">catalog routing</Link> ·{' '}
        <Link to="/docs/subagent-catalog">subagent catalog</Link>.
      </p>

      <h2 id="platforms">Platforms</h2>
      <p>
        The pack is host-agnostic markdown. <strong>Claude Code</strong> is the primary path with native slash
        commands, hooks, and the Agent tool. <strong>Cursor</strong> installs the bundled plugin via script and
        merges the root policy. <strong>Codex</strong> and <strong>OpenCode</strong> read the pack through an{' '}
        <code>AGENTS</code> file and their own plugin directory. <strong>Gemini CLI</strong> and{' '}
        <strong>Antigravity</strong> use the same markdown with a host-specific manifest. Running the full
        pipeline still expects an interactive host, because the human gates are real. Comparison table:{' '}
        <Link to="/docs/multi-platform-support">multi-platform support</Link> ·{' '}
        <Link to="/docs/host-support-tiers">host support tiers</Link>.
      </p>

      <h2 id="examples">Examples</h2>
      <p>These are illustrative shapes, not recorded transcripts.</p>
      <h3>Bug fix, lean track</h3>
      <pre>/work Fix the off-by-one error in pagination logic in src/api/list.py</pre>
      <p>
        Runs <code>feasibility</code> → <code>lean-track-check</code> → <code>lean-track-implementation</code> →{' '}
        <code>validation</code> → <code>pr-creation</code> → <code>approval-wait</code>. Resume with{' '}
        <code>/work &lt;id&gt;</code> once the PR is reviewed.
      </p>
      <h3>New feature, rigorous track</h3>
      <pre>/work Add rate limiting middleware to the Express API with Redis backing</pre>
      <p>
        Multi-file scope and a new dependency usually yield <strong>complex</strong>, which adds the design
        panel, <code>design-review</code>, <code>code-review</code>, and <code>permissions-check</code>.
      </p>
      <h3>Plan without building</h3>
      <pre>/plan-only Evaluate adding OAuth2 to the public API</pre>
      <p>
        Stops after the planning phases. No implementation branch is created unless you start a new{' '}
        <code>/work</code>. More: <Link to="/docs/examples">examples collection</Link>.
      </p>

      <div className="doc-see-also">
        <strong>Canonical policy</strong> —{' '}
        <a href="https://github.com/agentic-swe/agentic-swe" target="_blank" rel="noopener noreferrer">
          the source repository
        </a>{' '}
        (root <code>CLAUDE.md</code> is the Hypervisor policy)
        <br />
        <strong>More</strong> — <Link to="/docs/usage">Usage</Link> ·{' '}
        <Link to="/docs/durable-memory">Durable memory</Link> ·{' '}
        <Link to="/docs/claude-code-plugin">Claude Code plugin</Link> ·{' '}
        <Link to="/support">Support</Link>
      </div>
    </main>
  )
}
