# Windsurf

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host windsurf
```

Setup installs the portable pack under **`.agentic-swe/`**, merges **`CLAUDE.md`**, and merges Cascade hooks into **`.windsurf/hooks.json`**.

- **`pre_user_prompt`** runs entry maintenance.
- **`post_cascade_response_with_transcript`** captures the transcript and evolves memory.

## Restricted Mode

Windsurf does not run these hooks while Restricted Mode is enabled. Turn Restricted Mode off for this workspace, reload, and start a new Cascade session. Until you do, host parity can look installed while maintenance never runs.

**`agentic-swe host-parity`** reports Windsurf as **stable** when those hooks are allowed to run.

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

After a Cascade turn with Restricted Mode off, **`.agentic-swe/hook-receipts.jsonl`** should gain a line. A failure is also written to **`.agentic-swe/hook-notice.md`** and shown on the next session.

## Related

- **[Overview](/docs/installation#overview)** · **[Host capabilities](../host-support-tiers.md)** · **[Durable memory](../durable-memory.md)** · **[Troubleshooting](../troubleshooting.md)**
