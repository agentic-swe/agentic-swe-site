# VS Code

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host vscode
```

Setup installs the lifecycle extension at **`~/.vscode/extensions/agentic-swe.agentic-swe-lifecycle-<version>/`**, merges **`CLAUDE.md`**, and copies **`AGENTS.md`** only when that file is missing. Reload the window after it finishes.

## What is automatic

The extension maintains memory when a session starts, when files change, and when the session ends. That includes incremental indexing, lesson and style refresh, and procedure hygiene.

Generic VS Code does **not** capture an agent transcript. It cannot read another extension’s private chat log. Do not expect decision capture, Stop evolution from a Copilot or Cline transcript, or the same receipt detail you get on Claude Code or Cursor.

**`agentic-swe host-parity`** reports VS Code as **partial** for that reason.

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

Look for a new line in **`.agentic-swe/hook-receipts.jsonl`** after you edit a markdown file and reload. A missing transcript section in that receipt is expected.

## When you also use an agent in VS Code

- **GitHub Copilot** has its own setup: **`agentic-swe setup --host copilot`**. CLI and coding-agent hooks can capture transcripts. IDE chat coverage varies. The VS Code extension does not fill that gap.
- **Cline, Roo Code, Continue, Junie, and Zed** stay on **`AGENTS.md`** plus explicit MCP calls. See [Host capabilities](../host-support-tiers.md).

## Related

- **[Overview](/docs/installation#overview)** · **[Durable memory](../durable-memory.md)** · **[Troubleshooting](../troubleshooting.md)**
