# Codex

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host codex
```

Setup merges **`CLAUDE.md`**, copies **`AGENTS.md`** only when that file is missing, installs the portable pack under **`.agentic-swe/`**, and merges lifecycle hooks into **`.codex/hooks.json`**.

## Trust the hooks

Codex does not run those hooks until you approve them. Session start refreshes memory. Stop captures the transcript, evolves evidence-backed procedures, and writes **`.agentic-swe/hook-receipts.jsonl`**. Until you trust the hooks, that lifecycle does not run. Approve the repository or plugin hooks, then start a new session.

Check:

```bash
agentic-swe doctor
agentic-swe host-parity
```

Codex is **stable** when the trusted hooks run at SessionStart and Stop. Untrusted hooks are a configuration gap, not a missing adapter.

## What the hooks call

Both events run **`node .agentic-swe/scripts/host-lifecycle.cjs --host codex`** with **`--event start`** or **`--event stop`**. Node.js 18 or newer must be on `PATH`.

## Advanced and recovery

Use a checkout and symlinks only when setup cannot write the portable pack:

```bash
PACK=/path/to/agentic-swe
TARGET=/path/to/your-repo
cp "$PACK/AGENTS.md" "$TARGET/"
mkdir -p "$TARGET/.agentic-swe"
for d in commands phases agents templates references tools; do
  ln -sf "$PACK/$d" "$TARGET/.agentic-swe/$d"
done
ln -sf "$PACK/state-machine.json" "$TARGET/.agentic-swe/state-machine.json"
```

Prefer **`agentic-swe repair`** or a fresh **`setup --host codex`** before rebuilding that layout by hand. Pack notes also live in **`.codex/INSTALL.md`**.

## Usage

Start or resume with **`/work`** when Codex exposes pack commands. Otherwise open the matching file under **`.agentic-swe/commands/`**. State stays in **`.worklogs/<id>/`** in this repository.

| Command | Purpose |
|---------|---------|
| **`/work`** | Start or resume a work item |
| **`/check budget`** | Before phases |
| **`/check transition`** | Before **`state.json`** changes |
| **`/check artifacts`** | Required files for the next state |

## Related

- **[Codex](../README.codex.md)**
- **[Usage](../usage.md)** · **[Host capabilities](../host-support-tiers.md)** · **[Troubleshooting](../troubleshooting.md)**
