type StepKind = 'phase' | 'review' | 'gate' | 'terminal'

type Step = {
  name: string
  kind: StepKind
}

type Track = {
  id: 'lean' | 'standard' | 'rigorous'
  name: string
  when: string
  steps: Step[]
}

/** Mirrors the canonical edges in `state-machine.json` / the fenced graph in the root Hypervisor policy. */
const TRACKS: Track[] = [
  {
    id: 'lean',
    name: 'Lean',
    when: 'Feasibility verdict: simple',
    steps: [
      { name: 'feasibility', kind: 'phase' },
      { name: 'lean-track-check', kind: 'phase' },
      { name: 'lean-track-implementation', kind: 'phase' },
      { name: 'validation', kind: 'phase' },
      { name: 'pr-creation', kind: 'phase' },
      { name: 'approval-wait', kind: 'gate' },
      { name: 'completed', kind: 'terminal' },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    when: 'Feasibility verdict: standard',
    steps: [
      { name: 'feasibility', kind: 'phase' },
      { name: 'lean-track-check', kind: 'phase' },
      { name: 'design', kind: 'phase' },
      { name: 'verification', kind: 'phase' },
      { name: 'test-strategy', kind: 'phase' },
      { name: 'implementation', kind: 'phase' },
      { name: 'self-review', kind: 'review' },
      { name: 'validation', kind: 'phase' },
      { name: 'pr-creation', kind: 'phase' },
      { name: 'approval-wait', kind: 'gate' },
      { name: 'completed', kind: 'terminal' },
    ],
  },
  {
    id: 'rigorous',
    name: 'Rigorous',
    when: 'Feasibility verdict: complex',
    steps: [
      { name: 'feasibility', kind: 'phase' },
      { name: 'lean-track-check', kind: 'phase' },
      { name: 'design', kind: 'phase' },
      { name: 'design-review', kind: 'review' },
      { name: 'verification', kind: 'phase' },
      { name: 'test-strategy', kind: 'phase' },
      { name: 'implementation', kind: 'phase' },
      { name: 'self-review', kind: 'review' },
      { name: 'code-review', kind: 'review' },
      { name: 'permissions-check', kind: 'phase' },
      { name: 'validation', kind: 'phase' },
      { name: 'pr-creation', kind: 'phase' },
      { name: 'approval-wait', kind: 'gate' },
      { name: 'completed', kind: 'terminal' },
    ],
  },
]

const STEP_TAG: Partial<Record<StepKind, string>> = {
  review: 'review loop',
  gate: 'human gate',
  terminal: 'done',
}

export function PipelineViz() {
  return (
    <div className="topology">
      {TRACKS.map((track) => (
        <article key={track.id} className={`topology__track topology__track--${track.id}`}>
          <header className="topology__head">
            <h3 className="topology__name">{track.name} track</h3>
            <p className="topology__when">{track.when}</p>
          </header>
          <ol
            className="topology__steps"
            aria-label={`${track.name} track states, in order`}
          >
            {track.steps.map((step) => (
              <li key={step.name} className={`topology__step topology__step--${step.kind}`}>
                <span className="topology__step-name">{step.name}</span>
                {STEP_TAG[step.kind] ? (
                  <span className="topology__step-tag">{STEP_TAG[step.kind]}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </article>
      ))}

      <dl className="topology__legend">
        <div className="topology__legend-item topology__legend-item--gate">
          <dt className="topology__legend-term">Human gate</dt>
          <dd className="topology__legend-desc">
            The pipeline stops and waits for a person. <code>approval-wait</code> holds until the PR is
            actually approved; <code>ambiguity-wait</code> holds when the task is underspecified.
          </dd>
        </div>
        <div className="topology__legend-item topology__legend-item--review">
          <dt className="topology__legend-term">Review loop</dt>
          <dd className="topology__legend-desc">
            Bounded iteration with a counter in <code>state.json</code>. The same failure twice escalates
            instead of burning budget.
          </dd>
        </div>
        <div className="topology__legend-item topology__legend-item--source">
          <dt className="topology__legend-term">Source of truth</dt>
          <dd className="topology__legend-desc">
            Allowed edges live in <code>state-machine.json</code> and the fenced graph in the root policy.
            CI checks that the two agree.
          </dd>
        </div>
      </dl>
    </div>
  )
}
