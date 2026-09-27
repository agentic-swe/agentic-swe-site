# GitHub Copilot

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host copilot
```

Setup installs the portable pack under **`.agentic-swe/`**, merges **`CLAUDE.md`**, and writes **`.github/hooks/agentic-swe-memory.json`**.

That file hooks:

- **sessionStart** for entry maintenance
- **agentStop** for transcript capture and evolution

The commands call **`node .agentic-swe/scripts/host-lifecycle.cjs --host copilot`**.

## What is covered

Copilot CLI and coding-agent environments run this lifecycle. **`agentic-swe host-parity`** reports Copilot as **partial** because IDE chat transcript coverage is not consistent. A Copilot Chat session in an editor may never hand the pack a transcript. Maintenance can still run when the session-start hook fires. Capture and evolution then have nothing new to store.

Generic VS Code’s own extension does not fix that. **`agentic-swe setup --host vscode`** maintains files without reading Copilot’s private chat.

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

Use a Copilot CLI or coding-agent session when you want to confirm transcript capture. Read the latest **`.agentic-swe/hook-receipts.jsonl`** line and any **`.agentic-swe/hook-notice.md`**.

Tool-name hints for this host live in **`references/copilot-tools.md`** in the pack.

## Related

- **[Overview](/docs/installation#overview)** · **[Host capabilities](../host-support-tiers.md)** · **[Durable memory](../durable-memory.md)** · **[Troubleshooting](../troubleshooting.md)**
