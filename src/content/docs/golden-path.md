# Golden path: first success in about 15 minutes (Claude Code)

This page is the **try it now** path on Claude Code: install the pack, run one small task, see **`.worklogs/<id>/`**, and stop at a **human gate** before anything merges. Other hosts use the same worklogs after **`agentic-swe setup --host <host>`**. Limits are on **[Host capabilities](host-support-tiers.md)**.

## Prerequisites (about 2 minutes)

- **Claude Code** installed and signed in (CLI or app per Anthropic’s current docs).
- A **git checkout** of a real project you can modify (empty repo is fine; a tiny app is better for tests).
- Optional: **`gh`** authenticated if you want PR creation without friction.

## Step 1 — Install (about 3 minutes)

From the **target project** root, with Node.js 18+ and the Claude CLI on `PATH`:

```bash
agentic-swe setup --host claude-code
```

That merges **`CLAUDE.md`**, can gitignore **`.worklogs/`**, and installs the marketplace plugin. Confirm with **`agentic-swe doctor`**.

If you are already inside Claude Code and the CLI is not available to setup, the marketplace commands are the recovery path:

```text
/plugin marketplace add agentic-swe/agentic-swe
/plugin install agentic-swe@agentic-swe-catalog
```

**`/install`** only finishes a missed policy merge. Local pack development can use **`claude --plugin-dir /path/to/agentic-swe`**.

**Pass criteria:** Slash commands such as **`/work`** and **`/check transition`** appear when you type **`/`**.

Deep links: [Installation](installation.md) · [Claude Code plugin](claude-code-plugin.md) · [Troubleshooting](troubleshooting.md).

## Step 2 — Pick one of two example tasks (about 8 minutes)

Use natural language; the Hypervisor picks the **track** from **`lean-track-check`**. These examples match the shapes in [Examples](examples.md).

### Option A — Lean track (smallest blast radius)

Single-file, obvious fix — good for a first run:

```text
/work Fix the off-by-one bug in countItems in src/counter.js so it returns the array length (see examples/golden-path-demo in the agentic-swe repo if you copied the demo file into your project)
```

If you dropped the demo file into **`src/counter.js`**, the bug is intentional (`length - 1`). After the run you should see something like:

`initialized → feasibility → lean-track-check → lean-track-implementation → validation → pr-creation → approval-wait`

### Option B — Standard track (still under 15 minutes if the repo is small)

Scoped change with tests, **without** the full rigorous panel. The demo repo already exports **`APP_VERSION`**; extend coverage:

```text
/work Extend test/counter.test.js to assert APP_VERSION from src/counter.js matches a semantic version pattern (e.g. three dot-separated numbers) and run npm test
```

Expect **`pipeline.track`** to resolve to **`standard`** when complexity matches your policy — see **`CLAUDE.md`** for allowed transitions.

**Pass criteria:**

- A new directory **`.worklogs/<id>/`** exists with **`state.json`** and phase artifacts.
- **`progress.md`** updates as phases advance.
- The session **stops at `approval-wait`** (or your configured gate) before you treat the change as released.

## Step 3 — Inspect evidence (about 2 minutes)

Open:

- **`.worklogs/<id>/state.json`** — `current_state`, `history`, budgets.
- **`.worklogs/<id>/progress.md`** — human-readable trail.
- Phase outputs (e.g. **`implementation.md`**, **`validation.md`**) — what the agent claimed and ran.

Use **`/evaluate-work <id>`** for a health-style summary if your session supports it.

## What “done” means

You are successful when you can show the folder tree under **`.worklogs/`** and explain one gate you did not skip. You do not need a green CI run for that story. Other editors are a separate check: [Host capabilities](host-support-tiers.md).

## Repeatable demo kit

- **Tiny target repo:** [examples/golden-path-demo](https://github.com/agentic-swe/agentic-swe/tree/main/examples/golden-path-demo) in this repository (copy **`src/counter.js`** into your app or use the folder as a scratch repo).
- **Presenter outline:** same folder, **`DEMO_SCRIPT.md`** — bullet timings for a 2–3 minute screen recording.

## Next steps

- [Usage](usage.md) — commands, tracks, resume.
- [/check commands](check-commands.md) — budget and transition discipline.
- [Host capabilities](host-support-tiers.md) — what each host runs after setup.
