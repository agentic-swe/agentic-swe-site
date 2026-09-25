function setupPrompt(host: string, hostId: SetupHostId): string {
  const unixCommand =
    `curl -fsSL https://raw.githubusercontent.com/agentic-swe/agentic-swe/main/install.sh | bash && ` +
    `"$HOME/.local/bin/agentic-swe" setup --host ${hostId} --target "$PWD" --yes`
  const windowsCommand =
    `irm https://raw.githubusercontent.com/agentic-swe/agentic-swe/main/install.ps1 | iex; ` +
    `& "$HOME\\.local\\bin\\agentic-swe.cmd" setup --host ${hostId} --target "$PWD" --yes`
  return [
    `Set up Agentic SWE for ${host} in the current git repository.`,
    `Run the command for this operating system from the repository root, stop and report if it fails, then summarize what changed.`,
    `macOS/Linux: ${unixCommand}`,
    `Windows PowerShell: ${windowsCommand}`,
  ].join('\n')
}

export type SetupHostId = 'claude-code' | 'cursor' | 'vscode' | 'codex' | 'opencode' | 'antigravity'

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
    name: 'VS Code (Copilot)',
    prompt: setupPrompt('GitHub Copilot in VS Code', 'vscode'),
    link: (prompt) => `vscode://GitHub.Copilot-Chat/chat?prompt=${encodeURIComponent(prompt)}`,
  },
  {
    id: 'codex',
    name: 'Codex',
    prompt: setupPrompt('Codex', 'codex'),
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
]

export const DEFAULT_SETUP_HOST: SetupHostId = 'claude-code'

export function findSetupHost(id: string | null | undefined): SetupHost {
  return SETUP_HOSTS.find((host) => host.id === id) ?? SETUP_HOSTS[0]
}
