export const STABLE_LIFECYCLE_HOSTS = [
  'Claude Code',
  'Cursor',
  'OpenCode',
  'Codex',
  'Antigravity',
  'Windsurf',
  'Kiro',
] as const

export type HostBoundary = {
  id: string
  title: string
  body: string
}

export const HOST_BOUNDARIES: readonly HostBoundary[] = [
  {
    id: 'native',
    title: 'Stable native lifecycle',
    body: 'Claude Code, Cursor, OpenCode, Codex, Antigravity, Windsurf, and Kiro. Setup installs a native lifecycle adapter for each of these hosts.',
  },
  {
    id: 'copilot',
    title: 'GitHub Copilot is partial',
    body: 'Copilot is more than one surface — CLI, editor chat, and coding agent — and transcript lifecycle is not exposed on all of them. Partial coverage is not the same as a stable native adapter, and it is not generic VS Code.',
  },
  {
    id: 'vscode',
    title: 'VS Code maintenance, no transcripts',
    body: 'The generic VS Code extension refreshes memory when workspace files change. It does not capture session transcripts.',
  },
  {
    id: 'mcp',
    title: 'MCP is an explicit fallback',
    body: 'A host without a native hook can call the memory MCP tools. Those calls do not imply transcript access, and they do not run unless that host invokes them.',
  },
]
