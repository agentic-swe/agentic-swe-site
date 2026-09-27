# OpenCode

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host opencode
```

Setup installs the portable pack under **`.agentic-swe/`**, merges **`CLAUDE.md`**, and creates or updates **`opencode.json`** so the plugin entry is **`.agentic-swe/.opencode/plugins/agentic-swe.js`**. Existing **`opencode.json`** plugin entries are merged. Setup does not replace a non-JSON config.

You need **OpenCode** with plugins enabled and **Node.js 18 or newer**.

The plugin runs the shared lifecycle on normal chat turns: maintenance, transcript capture, and evolution. See [Durable memory](../durable-memory.md).

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

OpenCode is **stable** when the plugin loads and those turns run. Open the repository, start a chat, and run **`/work`** with a small task. Confirm **`.worklogs/<id>/state.json`** updates and the session stops at **`approval-wait`** before you merge.

## What the plugin does

- Registers **`commands/`**, **`phases/`**, **`agents/`**, **`templates/`**, and **`references/`** from the pack root.
- Prepends Hypervisor policy from **`CLAUDE.md`** into chat.
- Calls the same lifecycle maintenance Claude Code and Cursor run at session boundaries.

There is no Anthropic **`/plugin install`** step. Discovery is **`opencode.json`** plus the ESM plugin.

## Advanced and recovery

If you must wire a checkout yourself, point **`opencode.json`** at the plugin file and merge policy with **`node scripts/merge-claude-policy.js`**. A hand-made symlink to **`.opencode/plugins/agentic-swe.js`** is recovery. Setup’s **`opencode.json`** entry is the supported path.

Pack notes: **`.opencode/INSTALL.md`**.

## Tool names

| Pack concept | OpenCode surface |
|--------------|------------------|
| Subagent spawn | `opencode.agent.spawn` when the host exposes it |
| Shell | `opencode.shell.exec` |
| File tools | `opencode.file.*` |

## Related

- **[OpenCode](../README.opencode.md)**
- **[Overview](/docs/installation#overview)** · **[Host capabilities](../host-support-tiers.md)** · **[Troubleshooting](../troubleshooting.md)**
