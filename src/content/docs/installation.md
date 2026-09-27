# Installation

On the docs site this guide is a set of tabs. Open [the installation guide](/docs/installation#overview). The hash selects a tab when that tab exists (`#claude`, `#cursor`, `#codex`, `#opencode`, `#antigravity`, and `#vscode`, `#windsurf`, `#kiro`, `#copilot` when those tabs are published).

Primary command, from the root of the git repository you want to configure:

```bash
agentic-swe setup --host <host>
```

Hosts: **`claude-code`**, **`cursor`**, **`vscode`**, **`codex`**, **`opencode`**, **`antigravity`**, **`windsurf`**, **`kiro`**, **`copilot`**.

Codex requires hook trust. Windsurf requires Restricted Mode off. Copilot CLI and coding-agent hooks run; IDE transcripts vary. Generic VS Code maintains files and does not capture an agent transcript. Cline, Roo, Continue, Junie, and Zed use **`AGENTS.md`** plus explicit MCP.

Manual steps in each tab are recovery. Comparison: [Host capabilities](host-support-tiers.md) · [Multi-platform support](multi-platform-support.md).
