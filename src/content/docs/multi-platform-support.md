# Multi-platform support

Read [Host capabilities](host-support-tiers.md) for the current status of each adapter. This page is the install and hook map.

agentic-swe is one markdown pipeline. The Hypervisor session follows root **`CLAUDE.md`**. The pack layout is **`commands/`**, **`phases/`**, **`agents/`**, **`templates/`**, **`references/`**, and **`state-machine.json`**. Claude Code resolves that tree as **`${CLAUDE_PLUGIN_ROOT}/`**. Other hosts use the portable copy under **`.agentic-swe/`** after setup.

Reviewed 27 Sep 2026 against runtime source **3.3.1**, including [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71). npm still listed **3.3.0**, which does not include the new adapters.

## Install

From the repository root:

```bash
agentic-swe setup --host <host>
agentic-swe doctor
agentic-swe host-parity
```

| Platform | Primary install | Lifecycle | Read more |
|----------|-----------------|-----------|-----------|
| **Claude Code** | `agentic-swe setup --host claude-code` | Stable. Session start and stop, with transcript capture | [Claude Code plugin](claude-code-plugin.md), [install tab](/docs/installation#claude) |
| **Cursor** | `agentic-swe setup --host cursor` | Stable. Session start and stop | [Cursor plugin](cursor-plugin.md), [install tab](/docs/installation#cursor) |
| **OpenCode** | `agentic-swe setup --host opencode` | Stable. Maintenance on normal chat turns | [OpenCode](README.opencode.md), [install tab](/docs/installation#opencode) |
| **Codex** | `agentic-swe setup --host codex` | Stable after you trust hooks | [Codex](README.codex.md), [install tab](/docs/installation#codex) |
| **Antigravity** | `agentic-swe setup --host antigravity` | Stable. PreInvocation and Stop. Gemini CLI does not use these hooks | [Antigravity](antigravity.md), [install tab](/docs/installation#antigravity) |
| **Windsurf** | `agentic-swe setup --host windsurf` | Stable only when Restricted Mode is disabled | [Installation overview](/docs/installation#overview) |
| **Kiro** | `agentic-swe setup --host kiro` | Stable on Kiro v1 SessionStart and Stop | [Installation overview](/docs/installation#overview) |
| **GitHub Copilot** | `agentic-swe setup --host copilot` | Partial. CLI and coding-agent hooks; IDE transcripts vary | [Installation overview](/docs/installation#overview) |
| **VS Code** | `agentic-swe setup --host vscode` | Partial. File maintenance without agent transcript capture | [Installation overview](/docs/installation#overview) |
| **Gemini CLI** | **`gemini-extension.json`** plus **`GEMINI.md`** | Context file only. Not the Antigravity hook adapter | [Antigravity](antigravity.md) |

**Cline, Roo Code, Continue, Junie, and Zed** use **`AGENTS.md`** plus the MCP fallback. Calls are explicit. Details are on [Host capabilities](host-support-tiers.md).

Manual marketplace commands, curl installers, and symlink layouts remain on each install tab as recovery.

## Hooks

Session hooks load policy and run memory maintenance. Memory prime is on by default. Set **`AGENTIC_SWE_MEMORY_PRIME=0`** to skip the digest. Set **`AGENTIC_SWE_HOOK_LIFECYCLE=0`** to skip indexing, reflection, and hygiene. **`state.json`** still wins when memory and the work item disagree. See [Durable memory](durable-memory.md).

| Host | Hook file |
|------|-----------|
| Claude Code | **`hooks/hooks.json`** |
| Cursor | **`hooks/hooks-cursor.json`** |
| Codex | **`.codex/hooks.json`** |
| Antigravity | **`.agents/hooks.json`** |
| Windsurf | **`.windsurf/hooks.json`** |
| Kiro | **`.kiro/hooks/agentic-swe-memory.json`** |
| Copilot | **`.github/hooks/agentic-swe-memory.json`** |
| OpenCode | plugin under **`.agentic-swe/.opencode/`** |

Intent hints also live in **`${CLAUDE_PLUGIN_ROOT}/references/implicit-routing.md`** when the Claude plugin root is set. Otherwise read that file from the portable pack.

Tool-name notes: **`references/codex-tools.md`**, **`references/opencode-tools.md`**, **`references/gemini-tools.md`**, **`references/copilot-tools.md`**.

## What CI checks

**`npm test`** includes wiring checks for manifests, hook targets, and loading the OpenCode plugin in Node, plus **`claude plugin validate`** when the Claude CLI is on `PATH`. Those tests do not drive host UIs. A green CI run does not prove Windsurf Restricted Mode is off or that Codex hooks are trusted. Maintainer smoke is on the [Release checklist](release-checklist.md).

For a narrative walkthrough, open the [Guide](/guide#platforms).
