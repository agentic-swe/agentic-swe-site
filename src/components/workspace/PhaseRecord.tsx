import {
  PHASE_PANEL_ID,
  formatCents,
  phaseKindLabel,
  phaseStatusLabel,
  phaseTabId,
  type WorkspacePhase,
} from '../../data/workspace-demo'

type PhaseRecordProps = {
  phase: WorkspacePhase
}

export function PhaseRecord({ phase }: PhaseRecordProps) {
  const kindLabel = phaseKindLabel(phase.kind)

  return (
    <section
      id={PHASE_PANEL_ID}
      className="workspace-card workspace-record"
      role="tabpanel"
      aria-labelledby={phaseTabId(phase.id)}
      tabIndex={0}
    >
      <p className="workspace-kicker">Phase record</p>
      <h2 className="workspace-record__title">{phase.name}</h2>
      <ul className="workspace-pills" aria-label="Phase status">
        <li>{phaseStatusLabel(phase.status)}</li>
        {kindLabel ? <li>{kindLabel}</li> : null}
        <li>{formatCents(phase.costCents)}</li>
      </ul>
      <p className="workspace-record__summary">{phase.summary}</p>
      <dl className="workspace-facts">
        <div>
          <dt>Actor</dt>
          <dd>{phase.actor}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{phase.actorRole}</dd>
        </div>
        <div>
          <dt>Artifact</dt>
          <dd>
            <code>{phase.artifact}</code>
          </dd>
        </div>
      </dl>
      <h3 className="workspace-subhead">Evidence</h3>
      <ul className="workspace-evidence-list">
        {phase.evidence.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
