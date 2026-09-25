import type { DiffLine } from '../../data/workspace-demo'

const LINE_LABEL: Record<DiffLine['kind'], string> = {
  context: 'Context',
  add: 'Added',
  remove: 'Removed',
  hunk: 'Hunk',
}

type ChangeDiffProps = {
  path: string
  lines: readonly DiffLine[]
}

export function ChangeDiff({ path, lines }: ChangeDiffProps) {
  return (
    <section className="workspace-card workspace-diff" aria-labelledby="workspace-diff-title">
      <div className="workspace-card__head">
        <h2 id="workspace-diff-title">Implementation diff</h2>
        <code>{path}</code>
      </div>
      <p className="workspace-note">
        Added lines start with +, removed lines start with -. This diff is part of the sample, not a live branch.
      </p>
      <pre className="workspace-diff__code" tabIndex={0}>
        <code>
          {lines.map((line, index) => (
            <span key={`${line.kind}-${index}`} className={`workspace-diff__line workspace-diff__line--${line.kind}`}>
              <span className="workspace-sr">{LINE_LABEL[line.kind]}: </span>
              {line.text}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </section>
  )
}
