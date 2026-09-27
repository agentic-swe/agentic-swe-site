# Cursor

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host cursor
```

Setup installs the local plugin at **`~/.cursor/plugins/local/agentic-swe`**, merges root **`CLAUDE.md`**, and can add **`.worklogs/`** to **`.gitignore`**. Reload the window after it finishes. It will not replace that plugin folder when the folder is already a git checkout.

**`hooks/hooks-cursor.json`** runs session start and session stop. Both boundaries maintain memory, and stop captures the transcript. See [Durable memory](../durable-memory.md).

Cursor’s click-paths change. [Cursor’s plugin docs](https://cursor.com/docs/plugins.md) stay authoritative for the IDE UI. This page describes what setup writes.

## What you get

| Piece | Role |
|-------|------|
| **`.cursor-plugin/plugin.json`** | Manifest. Hooks point at **`hooks/hooks-cursor.json`**. **`commands/`** and **`agents/`** are discovered at the pack root. |
| **`hooks/hooks-cursor.json`** | **sessionStart** loads policy. **stop** captures the transcript and evolves procedures. |
| **`commands/*.md`** | Same prompts as Claude Code. The exact command UI depends on the Cursor build. |
| **`agents/**/*.md`** | Specialist prompts the session can open. |

The Claude **`UserPromptSubmit`** hooks that auto-start the brainstorm server and the work dashboard are not in the Cursor hook file. Start those helpers yourself when you need them.

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

Cursor is **stable** when session start and stop both run.

## Advanced and recovery

The older curl installer still works when you cannot run setup:

```bash
curl -fsSL https://raw.githubusercontent.com/agentic-swe/agentic-swe/main/scripts/install-cursor-plugin.sh | bash
```

From a checkout: **`bash scripts/install-cursor-plugin.sh`**. **`AGENTIC_SWE_PACK_ROOT`** symlinks a checkout. **`AGENTIC_SWE_TARGET_REPO`** merges policy when Node is available. **`AGENTIC_SWE_AUTO_GITIGNORE=1`** adds **`.worklogs/`** to **`.gitignore`**.

Standalone policy merge:

```bash
node /path/to/agentic-swe/scripts/merge-claude-policy.js --pack /path/to/agentic-swe --target /path/to/your-app
```

Optional project rules: merge **`AGENTS.md`**, or start **`.cursor/rules`** from **`templates/cursor-rules-stub.md`**.

## Running work

The session follows **`CLAUDE.md`**, reads pack commands, and writes **`.worklogs/<id>/`**. Use **`/check budget`**, **`/check transition`**, and **`/check artifacts`** before changing **`state.json`**. Tool names may differ from Claude Code. See **`references/*-tools.md`** in the pack.

## Related

- **[Cursor plugin](../cursor-plugin.md)**
- **[Overview](/docs/installation#overview)** · **[Host capabilities](../host-support-tiers.md)** · **[Troubleshooting](../troubleshooting.md)**
