function setupPrompt(host: string, hostId: SetupHostId, boundary?: string): string {
  const unixCommand =
    `curl -fsSL https://raw.githubusercontent.com/agentic-swe/agentic-swe/main/install.sh | bash && ` +
    `"$HOME/.local/bin/agentic-swe" setup --host ${hostId} --target "$PWD" --yes`
  const windowsCommand =
    `irm https://raw.githubusercontent.com/agentic-swe/agentic-swe/main/install.ps1 | iex; ` +
    `& "$HOME\\.local\\bin\\agentic-swe.cmd" setup --host ${hostId} --target "$PWD" --yes`
  return [
    `Set up Agentic SWE for ${host} in the current git repository.`,
    boundary,
    `Run the command for this operating system from the repository root, stop and report if it fails, then summarize what changed.`,
    `macOS/Linux: ${unixCommand}`,
    `Windows PowerShell: ${windowsCommand}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n')
}

export type SetupHostId =
  | 'claude-code'
  | 'cursor'
  | 'vscode'
  | 'codex'
  | 'opencode'
  | 'antigravity'
  | 'windsurf'
  | 'kiro'
  | 'copilot'

export type SetupHost = {
  id: SetupHostId
  name: string
  prompt: string
  /** Opens the host with the prompt prefilled; hosts without a URL scheme copy the prompt instead. */
  link?: (prompt: string) => string
}

export const SETUP_HOSTS: SetupHost[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    prompt: setupPrompt('Claude Code', 'claude-code'),
    link: (prompt) => `claude-cli://open?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    prompt: setupPrompt('Cursor', 'cursor'),
    link: (prompt) => `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(prompt)}`,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    prompt: setupPrompt(
      'VS Code',
      'vscode',
      'VS Code support is generic memory maintenance when files change. It does not capture session transcripts.',
    ),
  },
  {
    id: 'codex',
    name: 'Codex',
    prompt: setupPrompt(
      'Codex',
      'codex',
      'Codex will not run repository hooks until you trust them. Approve the hooks, then start a new session.',
    ),
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    prompt: setupPrompt('OpenCode', 'opencode'),
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    prompt: setupPrompt('Google Antigravity', 'antigravity'),
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    prompt: setupPrompt(
      'Windsurf',
      'windsurf',
      'Windsurf Cascade hooks run only when Restricted Mode is disabled for this workspace.',
    ),
  },
  {
    id: 'kiro',
    name: 'Kiro',
    prompt: setupPrompt('Kiro', 'kiro'),
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    prompt: setupPrompt(
      'GitHub Copilot',
      'copilot',
      'Copilot coverage is partial across CLI, editor, and coding-agent surfaces. Do not assume transcript capture on every surface.',
    ),
  },
]

export const DEFAULT_SETUP_HOST: SetupHostId = 'claude-code'

export function findSetupHost(id: string | null | undefined): SetupHost {
  return SETUP_HOSTS.find((host) => host.id === id) ?? SETUP_HOSTS[0]
}
