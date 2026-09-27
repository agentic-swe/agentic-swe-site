# Overview

These steps describe pack **3.3.1**, including [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71). If `agentic-swe setup` does not list your host, you are on an older install.

The same pack runs in your repository: policy in root **`CLAUDE.md`**, work state under **`.worklogs/<id>/`**, and local memory under **`.agentic-swe/`**. There is no project-operated backend.

## Install

From the **root** of the git repository you want to configure:

```bash
agentic-swe setup --host <host>
```

Setup refuses any directory that is not that repository’s root. It prints the planned changes and waits for confirmation. **`--dry-run`** only prints the plan. **`--yes`** skips the question. Omit **`--host`** to detect installed hosts, or pass **`--host all`**.

| Host | Command | What runs automatically |
|------|---------|-------------------------|
| Claude Code | `agentic-swe setup --host claude-code` | Session start and stop, including transcript capture |
| Cursor | `agentic-swe setup --host cursor` | Session start and stop, including transcript capture |
| OpenCode | `agentic-swe setup --host opencode` | Maintenance on normal chat turns |
| Codex | `agentic-swe setup --host codex` | Session start and stop **after you trust the hooks** |
| Antigravity | `agentic-swe setup --host antigravity` | Maintenance on PreInvocation and capture on Stop |
| Windsurf | `agentic-swe setup --host windsurf` | Cascade hooks **when Restricted Mode is disabled** |
| Kiro | `agentic-swe setup --host kiro` | Kiro v1 SessionStart and Stop |
| GitHub Copilot | `agentic-swe setup --host copilot` | CLI and coding-agent hooks; IDE chat transcripts vary |
| VS Code | `agentic-swe setup --host vscode` | Entry, change, and exit maintenance **without** agent transcript capture |

Then run **`agentic-swe doctor`**. **`agentic-swe host-parity`** prints **stable**, **partial**, or **instruction-only** for each host in the adapter list.

Open a host tab above for the files that command writes. Manual symlink and copy steps on those tabs are recovery paths.

## Trust and Restricted Mode

- **Codex** does not run repository or plugin hooks until you approve them. Until then, memory maintenance does not run.
- **Windsurf** does not run Cascade hooks while Restricted Mode is on. Turn Restricted Mode off for this workspace, then start a new session.
- **GitHub Copilot** hooks cover the CLI and coding-agent environments. A generic IDE chat may not expose a transcript, so capture there is not guaranteed.
- **Generic VS Code** maintains memory when files change and when the session starts or ends. It cannot read another extension’s private transcript.
- **Cline, Roo Code, Continue, Junie, and Zed** do not have this lifecycle. Keep **`AGENTS.md`** and call the memory MCP tools yourself. See [Host capabilities](../host-support-tiers.md).

## Prerequisites

- **Git**, and a repository you can modify
- **Node.js 18 or newer**, on `PATH`. Setup and the lifecycle hooks are Node programs
- **`agentic-swe` on `PATH`**, from a checkout of this source or from an install whose `setup --help` lists your host
- **GitHub CLI** (`gh`) only if you want the pull-request steps in the pack

## Terms

Short definitions are in the [Glossary](../glossary.md).

## After install

Memory maintenance runs on the normal session lifecycle. You do not run `npm run memory-index` after each task. Those commands are for bootstrap, diagnosis, and recovery. See [Durable memory](../durable-memory.md).

Opt out of automatic maintenance with **`AGENTIC_SWE_HOOK_LIFECYCLE=0`**. Opt out of the injected memory digest with **`AGENTIC_SWE_MEMORY_PRIME=0`**. Injected memory stays advisory: **`state.json`** and repository files win.

A first Claude Code run is the [Golden path](../golden-path.md). If something fails, see [Troubleshooting](../troubleshooting.md).

## Claude Code `/install`

**`/install`** is a Claude Code recovery command. It merges **`CLAUDE.md`** and prepares **`.worklogs/`** when the plugin is already enabled and setup did not finish that merge. It is not the install path for other hosts.

## Migrating an old `.claude/` tree

1. Run setup for the host you use.
2. Remove vendored **`.claude/commands`**, **`.claude/phases`**, and similar copies if you no longer want duplicates.
3. Move **`.claude/.work/<id>/`** to **`.worklogs/<id>/`** when needed. From a pack checkout, **`node scripts/migrate-work-state.js`** previews the move; add **`--apply`** to write it.

## Uninstall

- **Claude Code:** disable or remove the plugin in the host.
- **Cursor:** remove **`~/.cursor/plugins/local/agentic-swe`** if you do not want the local plugin.
- **VS Code:** remove the **`agentic-swe.agentic-swe-lifecycle`** extension folder under **`~/.vscode/extensions/`**.
- **Policy:** delete the block in root **`CLAUDE.md`** after `<!-- BEGIN autonomous-swe-pipeline policy`.
- **Owned files:** from the repository root, **`agentic-swe uninstall`** removes files whose hash still matches the install manifest. Review the plan before you confirm.
- **Work state only:** `rm -rf .worklogs`
