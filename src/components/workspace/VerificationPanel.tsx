import type { TestCase } from '../../data/workspace-demo'

type VerificationPanelProps = {
  command: string
  summary: string
  tests: readonly TestCase[]
}

export function VerificationPanel({ command, summary, tests }: VerificationPanelProps) {
  return (
    <section className="workspace-card" aria-labelledby="workspace-tests-title">
      <div className="workspace-card__head">
        <h2 id="workspace-tests-title">Verification</h2>
        <span className="workspace-status workspace-status--pass">Passed</span>
      </div>
      <p className="workspace-command">
        <code>{command}</code>
        <span>{summary}</span>
      </p>
      <p className="workspace-note">Four cases from the sample validation artifact. The recorded run is 14 passed.</p>
      <ul className="workspace-tests">
        {tests.map((test) => (
          <li key={test.name}>
            <span className="workspace-status workspace-status--pass">Passed</span>
            <span className="workspace-tests__name">{test.name}</span>
            <span className="workspace-tests__detail">{test.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
