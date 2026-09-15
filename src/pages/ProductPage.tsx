import { Link } from 'react-router-dom'
import { CATALOG_TOTAL } from '../data/catalog-counts'

const OUTCOMES: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: 'A receipt instead of a transcript',
    body:
      'When work finishes you get a rendered summary of every transition, what each one cost, the evidence behind it, and who approved the merge — computed from files in your repository rather than written by a model.',
  },
  {
    title: 'Effort that matches the change',
    body:
      'Feasibility classifies the work and the lean, standard, or rigorous track follows from that verdict. A typo fix does not collect a design panel, and a new subsystem does not skip one.',
  },
  {
    title: 'Work that gets cheaper when it repeats',
    body:
      'Validated runs are distilled into procedures. Once a procedure passes the evaluation gate, matching work can replay it instead of paying for frontier reasoning again.',
  },
  {
    title: 'A stop, not a surprise',
    body:
      'Ambiguity halts the run and produces a report. Approval blocks the merge until a person signs off. Exhausted loops escalate rather than retry. Every one of those outcomes is recorded with an actor.',
  },
]

const NOT_CLAIMS: ReadonlyArray<string> = [
  'It is not a hosted service. There is no multi-tenant cloud running your pipeline; your editor session, git, and CI are the runtime.',
  'It does not merge for you. The pipeline runs up to the approval gate and stops there.',
  'It is not a model. Agentic SWE governs whichever assistant you already pay for.',
  'It does not silently reuse memory. Unevaluated procedures are never replayed, and promotion needs two successes or a human approval.',
]

export function ProductPage() {
  return (
    <main id="main-content" className="page-main reveal visible product-page">
      <p className="section-label">// product</p>
      <h1>Why Agentic SWE</h1>

      <p className="product-lede">
        AI can already write the change. What it cannot do on its own is make the change reviewable — bounded in
        cost, explicit about evidence, stopped at the points where a person should decide. Agentic SWE is the
        governance layer that turns an assistant’s output into something a team can actually merge.
      </p>

      <h2>What you get</h2>
      <div className="product-outcomes">
        {OUTCOMES.map((outcome) => (
          <article key={outcome.title} className="product-outcome">
            <h3 className="product-outcome__title">{outcome.title}</h3>
            <p className="product-outcome__body">{outcome.body}</p>
          </article>
        ))}
      </div>

      <h2>How it is built</h2>
      <p>
        Agentic SWE is a <strong>markdown workflow pack</strong>: policies, phases, commands, and{' '}
        {CATALOG_TOTAL} specialist agent prompts that install into your repository. A single{' '}
        <strong>Hypervisor</strong> session — the chat you are already in — reads the root policy, owns{' '}
        <code>state.json</code>, runs the enforcement checks before every transition, and delegates bounded work
        to agents. Per-work state lives under <code>.worklogs/&lt;id&gt;/</code> and is committed like any other
        file. Nothing needs to be provisioned.
      </p>
      <p>
        The detail is on <Link to="/guide">how it works</Link>, and the individual mechanisms are broken out on{' '}
        <Link to="/capabilities">capabilities</Link>.
      </p>

      <h2>Who it is for</h2>
      <ul>
        <li>
          <strong>Engineering teams of roughly 2–20</strong> already using an AI coding assistant who need
          phased workflows, spend ceilings, and review gates before they can let it near the main branch.
        </li>
        <li>
          <strong>Senior individual contributors</strong> who want the same structure — and the same audit
          trail — on personal or small projects.
        </li>
        <li>
          <strong>Teams with a compliance obligation</strong> who need to show what an assistant did, why, and
          who approved it.
        </li>
      </ul>

      <h2>What we do not claim</h2>
      <ul>
        {NOT_CLAIMS.map((claim) => (
          <li key={claim}>{claim}</li>
        ))}
      </ul>
      <p>
        The pack is MIT licensed. Anything you build on top — custom packs, internal policies, training — stays
        yours; see <Link to="/docs/licensing">licensing</Link>.
      </p>

      <div className="product-cta">
        <Link className="btn btn-primary" to="/docs/installation">
          Install
        </Link>
        <Link className="btn btn-ghost" to="/guide">
          How it works
        </Link>
      </div>

      <div className="doc-see-also">
        <strong>See also</strong> — <Link to="/docs/product-positioning">Product positioning</Link> ·{' '}
        <Link to="/docs/adoption-one-pager">Adoption one-pager</Link> ·{' '}
        <Link to="/docs/licensing">Licensing</Link> · <Link to="/docs/distribution">Distribution</Link>
      </div>
    </main>
  )
}
