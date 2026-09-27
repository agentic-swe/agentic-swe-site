# Claude Code plugin

**Quick install**

From the root of the repository you are changing, with the Claude CLI on `PATH`:

```bash
agentic-swe setup --host claude-code
```

Setup adds the marketplace, installs **`agentic-swe@agentic-swe-catalog`**, and merges root **`CLAUDE.md`**. Commands, phases, agents, and hooks load from **`${CLAUDE_PLUGIN_ROOT}/`**. You do not copy the tree into **`project/.claude/`**.

Recovery, if you are already inside Claude Code:

```text
/plugin marketplace add agentic-swe/agentic-swe
/plugin install agentic-swe@agentic-swe-catalog
```

**`/install`** finishes a missed policy merge and **`.worklogs/`** setup. It is not required after a successful setup.

**Official docs:** [Plugins](https://code.claude.com/docs/en/plugins) · [Plugins reference](https://code.claude.com/docs/en/plugins-reference)

**Hooks:** **`hooks/hooks.json`** runs **`session-start`** (routing hint and memory prime by default; opt out with **`AGENTIC_SWE_MEMORY_PRIME=0`**), **`Stop`** for cost sync and transcript capture, and async helpers for **`/brainstorm`** / **`/swe-dashboard`**. See [Durable memory](durable-memory.md).

**More detail:** [Installation](installation.md) · [Usage](usage.md) · [Durable memory](durable-memory.md) · [Troubleshooting](troubleshooting.md)
