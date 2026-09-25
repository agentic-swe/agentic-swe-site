import { useState } from 'react'
import {
  WORKSPACE_CURRENT_PHASE_ID,
  WORKSPACE_DEMO,
  formatCents,
} from '../data/workspace-demo'
import { ApprovalGate } from '../components/workspace/ApprovalGate'
import { ChangeDiff } from '../components/workspace/ChangeDiff'
import { PhaseRecord } from '../components/workspace/PhaseRecord'
import { PhaseTimeline } from '../components/workspace/PhaseTimeline'
import { VerificationPanel } from '../components/workspace/VerificationPanel'

export function WorkspacePage() {
  const [selectedId, setSelectedId] = useState(WORKSPACE_CURRENT_PHASE_ID)
  const selected =
    WORKSPACE_DEMO.phases.find((phase) => phase.id === selectedId) ?? WORKSPACE_DEMO.phases[0]
  const spentLabel = `${formatCents(WORKSPACE_DEMO.spentCents)} of ${formatCents(WORKSPACE_DEMO.capCents)}`

  if (!selected) {
    return null
  }

  return (
    <main id="main-content" className="workspace">
      <p className="workspace-banner" role="note">
        Demonstration. This work item is static sample data. It is not read from a <code>.worklogs</code>{' '}
        directory, and nothing on this page changes a repository.
      </p>

      <header className="workspace-header">
        <p className="section-label">// workspace · {WORKSPACE_DEMO.workId}</p>
        <h1>{WORKSPACE_DEMO.title}</h1>
        <p className="workspace-objective">
          <span className="workspace-kicker">Objective</span>
          {WORKSPACE_DEMO.objective}
        </p>
      </header>

      <section className="workspace-status-grid" aria-label="Work item status">
        <article className="workspace-card workspace-activity">
          <p className="workspace-kicker">Active now</p>
          <p>{WORKSPACE_DEMO.activity}</p>
        </article>
        <article className="workspace-card">
          <p className="workspace-kicker">Track</p>
          <p className="workspace-stat">{WORKSPACE_DEMO.track}</p>
          <p className="workspace-note">{WORKSPACE_DEMO.trackReason}</p>
        </article>
        <article className="workspace-card">
          <div className="workspace-budget__row">
            <p className="workspace-kicker">Budget</p>
            <p className="workspace-budget__value">{spentLabel}</p>
          </div>
          <progress
            className="workspace-meter"
            value={WORKSPACE_DEMO.spentCents}
            max={WORKSPACE_DEMO.capCents}
          >
            {spentLabel} spent
          </progress>
          <dl className="workspace-inline-facts">
            <div>
              <dt>Duration</dt>
              <dd>{WORKSPACE_DEMO.duration}</dd>
            </div>
            <div>
              <dt>Pull request</dt>
              <dd>{WORKSPACE_DEMO.prLabel}</dd>
            </div>
          </dl>
        </article>
      </section>

      <div className="workspace-layout">
        <PhaseTimeline phases={WORKSPACE_DEMO.phases} selectedId={selected.id} onSelect={setSelectedId} />
        <PhaseRecord phase={selected} />
      </div>

      <div className="workspace-evidence">
        <ChangeDiff path={WORKSPACE_DEMO.diffPath} lines={WORKSPACE_DEMO.diff} />
        <div className="workspace-side">
          <VerificationPanel
            command={WORKSPACE_DEMO.testCommand}
            summary={WORKSPACE_DEMO.testSummary}
            tests={WORKSPACE_DEMO.tests}
          />
          <ApprovalGate {...WORKSPACE_DEMO.approval} />
        </div>
      </div>
    </main>
  )
}
