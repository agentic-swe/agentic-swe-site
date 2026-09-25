type ApprovalGateProps = {
  gate: string
  state: string
  detail: string
  requiredActor: string
}

export function ApprovalGate({ gate, state, detail, requiredActor }: ApprovalGateProps) {
  return (
    <section className="workspace-card workspace-gate" aria-labelledby="workspace-gate-title">
      <p className="workspace-kicker">Human gate</p>
      <h2 id="workspace-gate-title">{gate}</h2>
      <p className="workspace-gate__state">{state}</p>
      <dl className="workspace-facts">
        <div>
          <dt>Required actor</dt>
          <dd>{requiredActor}</dd>
        </div>
      </dl>
      <p>{detail}</p>
    </section>
  )
}
