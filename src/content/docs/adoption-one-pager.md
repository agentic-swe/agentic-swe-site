# Who this is for

Use this page to decide whether a pilot is worth a week. It matches what the source does. It is not a sales sheet.

Reviewed 27 Sep 2026 against runtime source **3.3.1**, including [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71). npm still listed **3.3.0**, which does not include the new adapters.

## In one sentence

A local pack for coding-agent sessions that need phased work, **`.worklogs/`** evidence, human gates, and automatic local memory on hosts that expose a lifecycle.

## Fit

| You are | A pilot makes sense when | Look elsewhere when |
|---------|--------------------------|---------------------|
| **A team lead** | Reviewers need artifacts and explicit stops (`approval-wait`, `ambiguity-wait`) | You need attested compliance clicks or two-way ticket sync from this repo |
| **An individual contributor** | You want **`/work`**, tracks, and **`/check`** on a real repository | You want a cloud runner with no local session |
| **Security or platform** | Markdown policy plus a local work engine is enough | You need a vendor-attested gate product |
| **A multi-editor group** | You can accept the capability table in [Host capabilities](host-support-tiers.md) | You need identical slash UX on every editor, including ones with no hook API |

## What a pilot includes

- The workflow pack: policies, phases, templates, and <!-- catalog-counts:start kind=total-line -->138 specialized subagents<!-- catalog-counts:end --> in the catalog.
- **`.worklogs/<id>/`** when the session follows **`CLAUDE.md`**.
- **`agentic-swe setup --host <host>`** as the install.
- Automatic memory on Claude Code, Cursor, OpenCode, Codex (after hook trust), Antigravity, Windsurf (Restricted Mode off), and Kiro.
- Partial coverage for Copilot (CLI and coding agent; IDE chat varies) and generic VS Code (maintenance without transcript capture).
- **`AGENTS.md`** plus explicit MCP for Cline, Roo, Continue, Junie, and Zed.

## What this repository does not include

| Expectation | What is true here |
|-------------|-------------------|
| One JSON API that every IDE implements the same way | Host adapters share a lifecycle script. Command UI and transcript access differ |
| Every chat refuses a bad transition by itself | **`/check transition`** and **`work-engine transition`** reject edges the track does not allow. A session that never calls them is not enforced |
| Tests run in our cloud | Tests run where the session already runs commands |
| A global billing meter | Per-work cost updates locally when the stop hook records it. There is no hosted meter |
| Enterprise telemetry | No project telemetry backend. See [Privacy](privacy.md) |

## How to evaluate

1. Run [Golden path](golden-path.md) on a scratch repository, or **`agentic-swe setup`** for your host and one small **`/work`** task.
2. Open **`.worklogs/<id>/state.json`** and confirm the session stopped at a gate.
3. Read **`.agentic-swe/hook-receipts.jsonl`** after the session. Codex should show a receipt only after hooks are trusted. Windsurf should show one only with Restricted Mode off.
4. Read [Examples](examples.md) for lean and standard prompt shapes.
5. Read [Product fit](product-positioning.md) if the pilot needs a written yes or no.
