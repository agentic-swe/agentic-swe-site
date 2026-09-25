import { useEffect } from 'react'
import {
  PHASE_PANEL_ID,
  WORKSPACE_DEMO,
  formatCents,
  phaseStatusLabel,
  phaseTabId,
  type WorkspacePhase,
} from '../../data/workspace-demo'

type PhaseTimelineProps = {
  phases: readonly WorkspacePhase[]
  selectedId: string
  onSelect: (phaseId: string) => void
}

export function PhaseTimeline({ phases, selectedId, onSelect }: PhaseTimelineProps) {
  function focusPhase(phaseId: string) {
    document.getElementById(phaseTabId(phaseId))?.focus()
  }

  function move(delta: number) {
    const index = phases.findIndex((phase) => phase.id === selectedId)
    const next = phases[(index + delta + phases.length) % phases.length]
    if (!next) return
    onSelect(next.id)
    focusPhase(next.id)
  }

  function selectEdge(edge: 'start' | 'end') {
    const phase = edge === 'start' ? phases[0] : phases[phases.length - 1]
    if (!phase) return
    onSelect(phase.id)
    focusPhase(phase.id)
  }

  useEffect(() => {
    const tab = document.getElementById(phaseTabId(selectedId))
    const timeline = tab?.parentElement
    if (!(tab instanceof HTMLElement) || !(timeline instanceof HTMLElement)) return
    const tabRect = tab.getBoundingClientRect()
    const listRect = timeline.getBoundingClientRect()
    if (tabRect.top < listRect.top || tabRect.bottom > listRect.bottom) {
      timeline.scrollTop += tabRect.top - listRect.top - 8
    }
    if (tabRect.left < listRect.left || tabRect.right > listRect.right) {
      timeline.scrollLeft += tabRect.left - listRect.left - 8
    }
  }, [selectedId])

  return (
    <div
      className="workspace-timeline"
      role="tablist"
      aria-orientation="vertical"
      aria-label={`Phases for ${WORKSPACE_DEMO.workId}`}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault()
          move(1)
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        } else if (event.key === 'Home') {
          event.preventDefault()
          selectEdge('start')
        } else if (event.key === 'End') {
          event.preventDefault()
          selectEdge('end')
        }
      }}
    >
      {phases.map((phase) => {
        const selected = phase.id === selectedId
        return (
          <button
            key={phase.id}
            id={phaseTabId(phase.id)}
            type="button"
            className={`workspace-phase workspace-phase--${phase.status}`}
            role="tab"
            aria-selected={selected}
            aria-controls={PHASE_PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(phase.id)}
          >
            <span className="workspace-phase__rail" aria-hidden />
            <span className="workspace-phase__body">
              <span className="workspace-phase__name">{phase.name}</span>
              <span className="workspace-phase__meta">
                <span>{phaseStatusLabel(phase.status)}</span>
                <span>{formatCents(phase.costCents)}</span>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
