import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Entry = {
  symptom: string
  fix: ReactNode
}

type Group = {
  id: string
  title: string
  desc: string
  entries: Entry[]
}

const GROUPS: Group[] = [
  {
    id: 'setup',
    title: 'Install and setup',
    desc: 'Nothing has run yet, or the commands are not there.',
    entries: [
      {
        symptom: 'Slash commands like /work do not exist',
        fix: (
          <>
            <p>
              Install from the root of the repository you have open, then reopen the assistant in that same
              directory:
            </p>
            <pre>{`agentic-swe setup --host claude-code`}</pre>
            <p>
              On Claude Code, commands resolve from the enabled plugin. If you are already inside Claude Code and
              setup cannot call the CLI, add the marketplace and install the plugin. <code>/install</code> only
              finishes a missed policy merge. It is not the setup step for other hosts.
            </p>
            <pre>
              {`/plugin marketplace add agentic-swe/agentic-swe
/plugin install agentic-swe@agentic-swe-catalog`}
            </pre>
            <p>
              Reference: <Link to="/docs/installation">installation guide</Link> ·{' '}
              <Link to="/docs/claude-code-plugin">Claude Code plugin</Link>.
            </p>
          </>
        ),
      },
      {
        symptom: 'I use Cursor, Codex, OpenCode, Antigravity, Windsurf, Kiro, Copilot, or VS Code',
        fix: (
          <>
            <p>One command from the repository root, then reload the editor if it was already open:</p>
            <pre>{`agentic-swe setup --host <host>`}</pre>
            <p>
              Host ids: <code>cursor</code>, <code>codex</code>, <code>opencode</code>, <code>antigravity</code>,{' '}
              <code>windsurf</code>, <code>kiro</code>, <code>copilot</code>, <code>vscode</code>. Then run{' '}
              <code>agentic-swe doctor</code>. Codex does nothing until you trust its hooks. Windsurf does nothing
              while Restricted Mode is on. Copilot IDE chat may not provide a transcript. Generic VS Code maintains
              files and does not capture an agent transcript.
            </p>
            <p>
              Reference: <Link to="/docs/host-support-tiers">host capabilities</Link> ·{' '}
              <Link to="/docs/multi-platform-support">multi-platform support</Link>.
            </p>
          </>
        ),
      },
      {
        symptom: 'Doctor, host parity, or a hook receipt looks wrong',
        fix: (
          <>
            <p>From the repository root:</p>
            <pre>
              {`agentic-swe doctor
agentic-swe host-parity`}
            </pre>
            <p>
              The latest lifecycle run is the last line of <code>.agentic-swe/hook-receipts.jsonl</code>. A failed
              step is also written to <code>.agentic-swe/hook-notice.md</code> and shown on the next session. Drifted
              owned files can be restored with <code>agentic-swe repair</code>. Repeat{' '}
              <code>agentic-swe setup --host &lt;host&gt;</code> before you rebuild hooks by hand.
            </p>
            <p>
              Reference: <Link to="/docs/troubleshooting">troubleshooting</Link> ·{' '}
              <Link to="/docs/durable-memory">durable memory</Link>.
            </p>
          </>
        ),
      },
      {
        symptom: 'Cline, Roo, Continue, Junie, or Zed',
        fix: (
          <p>
            These hosts have no lifecycle adapter. Keep <code>AGENTS.md</code> and call the memory MCP tools
            yourself (<code>agentic_swe_memory_refresh</code>, <code>agentic_swe_memory_prime</code>,{' '}
            <code>agentic_swe_memory_status</code>). A VS Code-compatible editor can still run{' '}
            <code>agentic-swe setup --host vscode</code> for changed-file maintenance. That does not capture the
            agent transcript. Reference: <Link to="/docs/host-support-tiers">host capabilities</Link>.
          </p>
        ),
      },
      {
        symptom: 'I switched hosts and the old work item looks empty',
        fix: (
          <p>
            Work state stays in <code>.worklogs/</code> and the project index stays in{' '}
            <code>.agentic-swe/memory.sqlite</code>. Run <code>agentic-swe setup --host &lt;new-host&gt;</code>, then{' '}
            <code>agentic-swe doctor</code>. Read the new hook receipt after one session. Use{' '}
            <code>agentic-swe repair</code> for drifted owned files. Do not delete the sqlite file unless you mean
            to drop the index. Reference: <Link to="/docs/troubleshooting">troubleshooting</Link>.
          </p>
        ),
      },
    ],
  },
  {
    id: 'running',
    title: 'Running the pipeline',
    desc: 'A work item started but is not behaving the way you expected.',
    entries: [
      {
        symptom: 'Every run stops at a budget or a gate',
        fix: (
          <>
            <p>
              That is the design, but the caps are tunable. Run <code>/check budget</code> and read{' '}
              <code>.worklogs/&lt;id&gt;/state.json</code> to see which counter is exhausted. Budgets are per
              track, so work routed to <strong>rigorous</strong> when it should be <strong>lean</strong> will
              feel unusually expensive.
            </p>
            <p>
              To change the ceilings deliberately rather than per run, set budget overrides in policy:{' '}
              <Link to="/docs/policy-as-code">policy as code</Link> ·{' '}
              <Link to="/docs/check-commands">check commands</Link>.
            </p>
          </>
        ),
      },
      {
        symptom: 'Work was routed to the wrong track',
        fix: (
          <p>
            The track comes from the feasibility verdict and is recorded as <code>pipeline.track</code> in{' '}
            <code>state.json</code>. If routing is consistently wrong for your repository, a policy can set a
            minimum track, and the Adaptive Track Router scores similarity against past worklogs. See{' '}
            <Link to="/docs/adaptive-track-router">adaptive track router</Link>.
          </p>
        ),
      },
      {
        symptom: 'A transition was rejected as not allowed',
        fix: (
          <p>
            Allowed edges depend on the active track. Run <code>/check transition</code> for the current{' '}
            <code>pipeline.track</code>; the canonical graph is <code>state-machine.json</code> plus the fenced
            block in the root policy, and CI checks that they match. Legacy work with no{' '}
            <code>pipeline.track</code> should be treated as <strong>rigorous</strong>.
          </p>
        ),
      },
      {
        symptom: 'A review loop keeps repeating',
        fix: (
          <p>
            Loop counters live in <code>state.json</code>, and the same root cause appearing twice in a row is
            meant to escalate rather than consume the rest of the budget. Check{' '}
            <code>reflection-log.md</code> in the work directory — the receiving phase is required to read it.
            For a bounded adversarial pass on one specific claim, use <code>/doubt</code>:{' '}
            <Link to="/docs/doubt-driven-verification">doubt-driven verification</Link>.
          </p>
        ),
      },
      {
        symptom: 'A specialist agent was not selected',
        fix: (
          <p>
            Auto-selection reads the <strong>Subagent Signals</strong> section that feasibility writes, and it
            may be skipped when remaining budget is low. You can always call one directly with{' '}
            <code>/subagent invoke &lt;agent&gt;</code>. Reference:{' '}
            <Link to="/docs/catalog-routing">catalog routing</Link>.
          </p>
        ),
      },
    ],
  },
  {
    id: 'state',
    title: 'Upgrades and work state',
    desc: 'Something that used to work broke after a version change.',
    entries: [
      {
        symptom: 'State looks wrong after upgrading the pack',
        fix: (
          <>
            <p>
              Major releases can change <code>state.json</code> or the state machine. From a checkout of the
              pack repository, run the migration dry-run first, then apply it:
            </p>
            <pre>
              {`node scripts/migrate-work-state.js
node scripts/migrate-work-state.js --apply`}
            </pre>
            <p>
              Read <code>CHANGELOG.md</code> for the release, and confirm your merged policy block matches{' '}
              <code>state-machine.json</code> afterwards.
            </p>
          </>
        ),
      },
      {
        symptom: 'I want to confirm the pack itself is intact',
        fix: (
          <p>
            From a clone of the repository, run <code>claude plugin validate</code> (or{' '}
            <code>/plugin validate</code> in Claude Code, if your version supports it). Reference:{' '}
            <Link to="/docs/claude-code-plugin">Claude Code plugin</Link> ·{' '}
            <Link to="/docs/release-checklist">release checklist</Link>.
          </p>
        ),
      },
      {
        symptom: 'A resumed work item lost its context',
        fix: (
          <p>
            Resume reads from files, not from thread memory: <code>/work &lt;id&gt;</code> reloads{' '}
            <code>.worklogs/&lt;id&gt;/state.json</code> and continues from <code>current_state</code>.
            If artifacts are missing, <code>/check artifacts</code> will name which ones. Make sure{' '}
            <code>.worklogs/</code> was committed or otherwise preserved.
          </p>
        ),
      },
    ],
  },
  {
    id: 'policy',
    title: 'Policy, licensing, and privacy',
    desc: 'Questions that usually come from outside the engineering team.',
    entries: [
      {
        symptom: 'How do I enforce rules across every repository?',
        fix: (
          <p>
            Organisation, repository, and pack policies merge deterministically and can set minimum tracks,
            mandatory subagents, banned tools, and budget overrides. Validate a repository against the merged
            result with <code>/policy check</code>. Reference:{' '}
            <Link to="/docs/policy-as-code">policy as code</Link> ·{' '}
            <Link to="/docs/owai-spec">open work-item interchange</Link>.
          </p>
        ),
      },
      {
        symptom: 'What data leaves my machine?',
        fix: (
          <p>
            The pack has no project telemetry backend. Lifecycle hooks score transcripts locally and write{' '}
            <code>.agentic-swe/memory.sqlite</code>, lessons, style, procedures, and hook receipts on your machine.
            Your coding host still sends prompts to its own model provider. Embeddings and cross-model review call
            out only when you enable them. Reference: <Link to="/docs/privacy">privacy</Link> ·{' '}
            <Link to="/docs/cross-model-review">cross-model review</Link>.
          </p>
        ),
      },
      {
        symptom: 'What are the licence terms?',
        fix: (
          <p>
            The pack is MIT licensed; the repository <code>LICENSE</code> file is authoritative. Summary:{' '}
            <Link to="/docs/licensing">licensing</Link>.
          </p>
        ),
      },
    ],
  },
]

export function SupportPage() {
  return (
    <main id="main-content" className="page-main reveal visible support-page">
      <p className="section-label">// support</p>
      <h1>Troubleshooting</h1>
      <p className="support-lede">
        Grouped by what you are seeing rather than by feature. Open the entry that matches your symptom; each
        one ends with the reference page that goes deeper. If your problem is conceptual rather than broken,{' '}
        <Link to="/guide">how it works</Link> is probably the faster read.
      </p>

      <div className="support-hub">
        {GROUPS.map((group) => (
          <section key={group.id} className="support-group" aria-labelledby={`support-${group.id}`}>
            <h2 id={`support-${group.id}`} className="support-group__title">
              {group.title}
            </h2>
            <p className="support-group__desc">{group.desc}</p>
            <div className="support-list">
              {group.entries.map((entry) => (
                <details key={entry.symptom} className="support-entry">
                  <summary className="support-entry__symptom">{entry.symptom}</summary>
                  <div className="support-entry__fix">{entry.fix}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="support-escalate" aria-labelledby="support-escalate-title">
        <h2 id="support-escalate-title">Still stuck</h2>
        <p>
          Include <code>agentic-swe doctor</code>, the last line of <code>.agentic-swe/hook-receipts.jsonl</code>,{' '}
          <code>agentic-swe version</code>, and the host you used. <code>/check budget</code> and{' '}
          <code>.worklogs/&lt;id&gt;/state.json</code> still help when a work item is the problem.
        </p>
        <div className="support-escalate__actions">
          <a
            className="btn btn-primary"
            href="https://github.com/agentic-swe/agentic-swe/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open a GitHub issue
          </a>
          <Link className="btn btn-ghost" to="/documentation">
            Browse all documentation
          </Link>
        </div>
      </section>

      <div className="doc-see-also">
        <strong>See also</strong> — <Link to="/docs/troubleshooting">Troubleshooting reference</Link> ·{' '}
        <Link to="/docs/installation">Installation</Link> · <Link to="/docs/usage">Usage</Link> ·{' '}
        <Link to="/docs/check-commands">Check commands</Link>
      </div>
    </main>
  )
}
