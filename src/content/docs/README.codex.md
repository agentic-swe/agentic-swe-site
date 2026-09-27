# Codex

**Quick setup**

From the root of the repository you want to change:

```bash
agentic-swe setup --host codex
```

Setup merges **`CLAUDE.md`**, leaves an existing **`AGENTS.md`** in place, installs the portable pack under **`.agentic-swe/`**, and merges **`.codex/hooks.json`**.

**Trust the hooks** when Codex asks. Until you do, session start and stop do not run, and memory is not captured. After approval, start and stop maintain memory automatically. npm memory commands are for recovery. See [Durable memory](durable-memory.md).

Start work with **`/work`** when Codex exposes pack commands.

**Recovery layout:** **`.codex/INSTALL.md`** in the pack, and the [Codex install tab](/docs/installation#codex).

**More detail:** [Installation](installation.md) · [Usage](usage.md) · [Host capabilities](host-support-tiers.md) · [Durable memory](durable-memory.md)
