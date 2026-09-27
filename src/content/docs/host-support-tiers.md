# Host capabilities

Reviewed 27 Sep 2026 against runtime source **3.3.1**, including [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71) (merge commit `3d9788d`). npm still listed **3.3.0**, which does not include the new adapters.

Support means what the host adapter actually runs today. Run **`agentic-swe host-parity`** on your machine. It prints one status per adapter in **`config/host-adapters.json`**.

| Status | Meaning |
|--------|---------|
| **stable** | Session start and stop both run, and the host exposes the transcript lifecycle the adapter expects |
| **partial** | Maintenance runs, but transcript capture is missing or inconsistent |
| **instruction-only** | No lifecycle API. You follow **`AGENTS.md`** and call tools yourself |

## Automatic lifecycle

These hosts run the shared lifecycle after **`agentic-swe setup --host <host>`**:

| Host | Parity | Boundary you must know |
|------|--------|------------------------|
| **Claude Code** | stable | Marketplace plugin hooks at session start and stop |
| **Cursor** | stable | **`hooks/hooks-cursor.json`** session start and stop |
| **OpenCode** | stable | Plugin runs maintenance on normal chat turns |
| **Codex** | stable | Hooks run only after you trust them |
| **Antigravity** | stable | **PreInvocation** maintains, **Stop** captures. Gemini CLI is not this hook contract |
| **Windsurf** | stable | Cascade hooks run only when Restricted Mode is **disabled** |
| **Kiro** | stable | Kiro **v1** SessionStart and Stop |
| **GitHub Copilot** | partial | CLI and coding-agent hooks run. IDE chat transcripts are not consistently available |
| **VS Code** | partial | Extension maintains memory on entry, change, and exit. It does not capture an agent transcript |

Install commands and file paths: [Installation](/docs/installation#overview).

## Instruction-only hosts

**Cline, Roo Code, Continue, Junie, and Zed** do not have this lifecycle adapter. Use them like this:

1. Keep the generated root **`AGENTS.md`** as the project rule. Copy it into a host rules directory only when that host does not read **`AGENTS.md`**.
2. If the editor is VS Code-compatible, **`agentic-swe setup --host vscode`** still performs changed-file maintenance. That does not add transcript capture.
3. Merge **`integrations/fallback/agentic-swe-memory.mcp.json`** into the host MCP config. Do not replace an existing MCP file wholesale.

The server exposes **`agentic_swe_memory_refresh`**, **`agentic_swe_memory_prime`**, and **`agentic_swe_memory_status`**. Something must call those tools. MCP does not imply transcript access, automatic Stop capture, or evolution.

## Same engine, different command UI

Every host above can follow the same policy and write **`.worklogs/<id>/`**. Slash-command chrome is not identical. Claude Code discovers **`commands/`** from the plugin root. Other hosts discover those files when their plugin or **`AGENTS.md`** path points at the pack. When a host has no slash UI, open the phase file and ask the session to follow it.

**`work-engine`** rejects a transition that the active track does not allow, when **`/check transition`** or **`work-engine transition`** runs. The session is still expected to call that check. A chat that never calls it is not a harness.

## Where to read next

| Host | Page |
|------|------|
| Claude Code | [Claude Code plugin](claude-code-plugin.md) · [install tab](/docs/installation#claude) |
| Cursor | [Cursor plugin](cursor-plugin.md) · [install tab](/docs/installation#cursor) |
| OpenCode | [OpenCode](README.opencode.md) · [install tab](/docs/installation#opencode) |
| Codex | [Codex](README.codex.md) · [install tab](/docs/installation#codex) |
| Antigravity | [Antigravity](antigravity.md) · [install tab](/docs/installation#antigravity) |
| VS Code, Windsurf, Kiro, Copilot | [Installation overview](/docs/installation#overview) |

Comparison table: [Multi-platform support](multi-platform-support.md). Plain-language terms: [Glossary](glossary.md).
