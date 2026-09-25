export type PhaseKind = 'phase' | 'review' | 'gate'
export type PhaseStatus = 'complete' | 'current'

export type WorkspacePhase = {
  id: string
  name: string
  kind: PhaseKind
  status: PhaseStatus
  costCents: number
  actor: string
  actorRole: string
  summary: string
  evidence: readonly string[]
  artifact: string
}

export type DiffLine = {
  kind: 'context' | 'add' | 'remove' | 'hunk'
  text: string
}

export type TestCase = {
  name: string
  status: 'passed'
  detail: string
}

export type WorkspaceDemo = {
  workId: string
  title: string
  objective: string
  track: 'standard'
  trackReason: string
  capCents: number
  spentCents: number
  duration: string
  prLabel: string
  activity: string
  phases: readonly WorkspacePhase[]
  diffPath: string
  diff: readonly DiffLine[]
  testCommand: string
  testSummary: string
  tests: readonly TestCase[]
  approval: {
    gate: string
    state: string
    detail: string
    requiredActor: string
  }
}

const phases: readonly WorkspacePhase[] = [
  {
    id: 'feasibility',
    name: 'feasibility',
    kind: 'phase',
    status: 'complete',
    costCents: 8,
    actor: 'developer',
    actorRole: 'Reads the repository and writes the feasibility artifact.',
    summary:
      'The HTTP client calls fetch once and throws on any failed response. The change stays inside that module.',
    evidence: [
      'src/http-client.js has no retry loop',
      'Call sites already use this helper as the only network boundary',
      'No new service or subsystem is required',
    ],
    artifact: '.worklogs/add-retry-logic/feasibility.md',
  },
  {
    id: 'lean-track-check',
    name: 'lean-track-check',
    kind: 'phase',
    status: 'complete',
    costCents: 4,
    actor: 'Hypervisor',
    actorRole: 'Chooses the track and writes pipeline.track. It does not delegate this decision.',
    summary:
      'The behavior change needs a retry policy and tests, so the lean track is declined and the standard track is selected.',
    evidence: ['Verdict: standard', 'pipeline.track written to state.json', 'Standard cap is $8.00'],
    artifact: '.worklogs/add-retry-logic/state.json',
  },
  {
    id: 'design',
    name: 'design',
    kind: 'phase',
    status: 'complete',
    costCents: 31,
    actor: 'developer',
    actorRole: 'Writes the plan the implementation has to follow.',
    summary:
      'Retry only GET and HEAD. Use exponential backoff, at most two retries, and do not retry ordinary 4xx responses.',
    evidence: [
      'POST and PUT are not retried',
      '408, 429, and 5xx may retry',
      'Delay starts at 200ms and doubles once',
    ],
    artifact: '.worklogs/add-retry-logic/design.md',
  },
  {
    id: 'verification',
    name: 'verification',
    kind: 'phase',
    status: 'complete',
    costCents: 12,
    actor: 'developer',
    actorRole: 'Checks the plan against the current call sites.',
    summary:
      'Three call sites use the helper, all with GET. None of them depend on a 503 failing immediately.',
    evidence: [
      'Three GET call sites, no POST call sites',
      'No existing timeout helper conflicts with the delay',
    ],
    artifact: '.worklogs/add-retry-logic/verification.md',
  },
  {
    id: 'test-strategy',
    name: 'test-strategy',
    kind: 'phase',
    status: 'complete',
    costCents: 9,
    actor: 'developer',
    actorRole: 'Names the checks that have to pass before a pull request can open.',
    summary:
      'Tests must cover a transient success, a client error that must not retry, and a budget that runs out.',
    evidence: ['Command: npm test', 'Cases are named before implementation starts'],
    artifact: '.worklogs/add-retry-logic/test-strategy.md',
  },
  {
    id: 'implementation',
    name: 'implementation',
    kind: 'phase',
    status: 'complete',
    costCents: 133,
    actor: 'developer',
    actorRole: 'Applies the plan in src/http-client.js.',
    summary:
      'The retry loop is in the client. Fetch options other than the retry budget are passed through unchanged.',
    evidence: [
      'src/http-client.js updated',
      'Retry budget is an argument, not a hidden constant',
    ],
    artifact: '.worklogs/add-retry-logic/implementation.md',
  },
  {
    id: 'self-review',
    name: 'self-review',
    kind: 'review',
    status: 'complete',
    costCents: 18,
    actor: 'developer',
    actorRole: 'Reviews its own change against the design before validation.',
    summary:
      'The first draft retried every status below 500. That was narrowed to the statuses named in the design.',
    evidence: ['self_review_iter: 1', 'The finding was closed before validation'],
    artifact: '.worklogs/add-retry-logic/self-review.md',
  },
  {
    id: 'validation',
    name: 'validation',
    kind: 'phase',
    status: 'complete',
    costCents: 21,
    actor: 'developer',
    actorRole: 'Runs the verification command and records the result.',
    summary: 'npm test passed. Fourteen tests ran, including the four retry cases.',
    evidence: ['14 passed, 0 failed', 'Output stored with the work item'],
    artifact: '.worklogs/add-retry-logic/validation-results.md',
  },
  {
    id: 'pr-creation',
    name: 'pr-creation',
    kind: 'phase',
    status: 'complete',
    costCents: 5,
    actor: 'pr-manager',
    actorRole: 'Opens the pull request and records the link.',
    summary: 'The pull request is open. The pipeline moved to the human gate and stopped.',
    evidence: ['Pull request: example/repo#142', 'pr-link.txt written'],
    artifact: '.worklogs/add-retry-logic/pr-link.txt',
  },
  {
    id: 'approval-wait',
    name: 'approval-wait',
    kind: 'gate',
    status: 'current',
    costCents: 0,
    actor: 'Human reviewer',
    actorRole: 'Approves or rejects the pull request. No agent can take this step.',
    summary:
      'The pull request is waiting. The Hypervisor will not merge it, and this demonstration ends in that waiting state.',
    evidence: ['Gate actor is a person', 'No merge is recorded in the sample'],
    artifact: '.worklogs/add-retry-logic/state.json',
  },
]

const spentCents = phases.reduce((sum, phase) => sum + phase.costCents, 0)

export const WORKSPACE_DEMO: WorkspaceDemo = {
  workId: 'add-retry-logic',
  title: 'Add retry logic to the API client',
  objective:
    'Add bounded retry with exponential backoff to the API client so transient failures can succeed without retrying requests that are unsafe to repeat.',
  track: 'standard',
  trackReason:
    'Feasibility classed the work as standard: it changes runtime behavior and needs tests, and it does not cross a subsystem boundary.',
  capCents: 800,
  spentCents,
  duration: '38 min',
  prLabel: 'example/repo#142',
  activity:
    'No agent is running. The Hypervisor is holding at approval-wait until a person approves the pull request.',
  phases,
  diffPath: 'src/http-client.js',
  diff: [
    { kind: 'hunk', text: '@@ -1,11 +1,22 @@' },
    { kind: 'add', text: '+const RETRYABLE = new Set([408, 429, 500, 502, 503, 504])' },
    { kind: 'add', text: '+' },
    { kind: 'context', text: ' async function request(url, options = {}) {' },
    { kind: 'remove', text: '-  const response = await fetch(url, options)' },
    { kind: 'remove', text: '-  if (!response.ok) {' },
    { kind: 'remove', text: '-    throw new Error(`Request failed: ${response.status}`)' },
    { kind: 'remove', text: '-  }' },
    { kind: 'remove', text: '-  return response' },
    { kind: 'add', text: "+  const method = (options.method ?? 'GET').toUpperCase()" },
    { kind: 'add', text: "+  const retries = method === 'GET' || method === 'HEAD' ? options.retries ?? 2 : 0" },
    { kind: 'add', text: '+  const baseDelayMs = options.retryDelayMs ?? 200' },
    { kind: 'add', text: '+  let attempt = 0' },
    { kind: 'add', text: '+' },
    { kind: 'add', text: '+  while (attempt <= retries) {' },
    { kind: 'add', text: '+    const response = await fetch(url, options)' },
    { kind: 'add', text: '+    if (response.ok || !RETRYABLE.has(response.status) || attempt === retries) {' },
    { kind: 'add', text: '+      return response' },
    { kind: 'add', text: '+    }' },
    { kind: 'add', text: '+    attempt += 1' },
    { kind: 'add', text: '+    await delay(baseDelayMs * 2 ** (attempt - 1))' },
    { kind: 'add', text: '+  }' },
    { kind: 'context', text: ' }' },
  ],
  testCommand: 'npm test',
  testSummary: '14 passed, 0 failed · 1.8s',
  tests: [
    {
      name: 'retries a 503 and returns the next successful response',
      status: 'passed',
      detail: 'Two attempts. The second response is returned.',
    },
    {
      name: 'does not retry a 400',
      status: 'passed',
      detail: 'fetch is called once.',
    },
    {
      name: 'does not retry POST',
      status: 'passed',
      detail: 'A 503 on POST fails immediately.',
    },
    {
      name: 'stops after the retry budget is spent',
      status: 'passed',
      detail: 'Three attempts, then the last 503 is returned.',
    },
  ],
  approval: {
    gate: 'approval-wait',
    state: 'Waiting for a person',
    detail:
      'In a real run this gate stays closed until someone approves the pull request. This page cannot approve or merge anything.',
    requiredActor: 'Human reviewer',
  },
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export function phaseTabId(phaseId: string): string {
  return `workspace-phase-${phaseId}`
}

export const PHASE_PANEL_ID = 'workspace-phase-panel'

export function phaseStatusLabel(status: PhaseStatus): string {
  return status === 'current' ? 'Waiting' : 'Complete'
}

export function phaseKindLabel(kind: PhaseKind): string | null {
  if (kind === 'review') return 'Review'
  if (kind === 'gate') return 'Human gate'
  return null
}

const currentPhase = WORKSPACE_DEMO.phases.find((phase) => phase.status === 'current')
if (!currentPhase) {
  throw new Error('Workspace demonstration is missing its current phase.')
}

export const WORKSPACE_CURRENT_PHASE_ID = currentPhase.id
