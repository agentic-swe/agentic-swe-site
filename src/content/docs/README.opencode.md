# OpenCode

**Quick setup**

From the root of the repository you want to change:

```bash
agentic-swe setup --host opencode
```

Setup installs **`.agentic-swe/`**, merges **`CLAUDE.md`**, and points **`opencode.json`** at **`.agentic-swe/.opencode/plugins/agentic-swe.js`**.

The plugin runs lifecycle maintenance on normal chat turns, including transcript capture. You do not run npm memory commands after each task. See [Durable memory](durable-memory.md).

State and artifacts live under **`.worklogs/<id>/`**. Run **`/work`** when OpenCode exposes pack commands.

**Recovery:** **`.opencode/INSTALL.md`** in the pack, and the [OpenCode install tab](/docs/installation#opencode).

**More detail:** [Installation](installation.md) · [Host capabilities](host-support-tiers.md) · [Durable memory](durable-memory.md) · [Troubleshooting](troubleshooting.md)
