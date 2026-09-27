# Kiro

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host kiro
```

Setup installs the portable pack under **`.agentic-swe/`**, merges **`CLAUDE.md`**, and writes Kiro v1 hooks to **`.kiro/hooks/agentic-swe-memory.json`**.

The file registers two hooks:

- **SessionStart** runs **`host-lifecycle.cjs --host kiro --event start`**
- **Stop** runs **`host-lifecycle.cjs --host kiro --event stop`**

Both use Node.js from **`PATH`**. Start maintains the index and reflection. Stop captures the transcript and evolves procedures.

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

Kiro is **stable** when those v1 hooks run. Confirm a new **`.agentic-swe/hook-receipts.jsonl`** line after a session. This adapter does not claim older Kiro hook formats.

## Related

- **[Overview](/docs/installation#overview)** · **[Host capabilities](../host-support-tiers.md)** · **[Durable memory](../durable-memory.md)** · **[Troubleshooting](../troubleshooting.md)**
