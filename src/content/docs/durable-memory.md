# Durable memory (optional)

The pack can index **local** project context into **`.agentic-swe/memory.sqlite`** (gitignored) and emit a bounded **memory prime** markdown block for the Hypervisor. This is **advisory only**: **`state.json`**, **`progress.md`**, and repository files stay authoritative (see root **`CLAUDE.md`** Source priority).

**Canonical spec (repo):** [memory-graph.md](https://github.com/agentic-swe/agentic-swe/blob/main/docs/specs/memory-graph.md) — config schema, SQLite tables, retrieval modes, and implementation paths.

## What runs automatically

On Claude Code, Cursor, and OpenCode, session start and session stop:

- index markdown that changed since the last session
- refresh **`.agentic-swe/lessons.json`** and the style profile
- capture and score transcript evidence
- quarantine malformed or duplicate procedures
- write **`.agentic-swe/hook-receipts.jsonl`**, and inject **`.agentic-swe/hook-notice.md`** when a step fails

Opt out of that maintenance with **`AGENTIC_SWE_HOOK_LIFECYCLE=0`**. **Memory prime** still runs by default. Opt out of prime with **`AGENTIC_SWE_MEMORY_PRIME=0`**.

## Bootstrap, diagnostics, and recovery

These commands are not part of normal task flow.

| NPM script | When to run it |
|------------|----------------|
| **`npm run memory-index`** | Rebuild the full project graph and markdown chunks after a corrupted index, or before using embeddings. |
| **`npm run memory-prime`** | Print the same bounded digest the session hook injects. |
| **`npm run memory-reflect`** | Rebuild lessons outside a session when a hook receipt says reflection failed. |
| **`npm run memory-compact`** | Write **`context-compact.md`** under a work item: **`--work-dir /abs/path/.worklogs/<id>`**. |
| **`npm run memory-import`** | Merge a validated **JSON bundle** into **`memory.sqlite`**. Requires **`import_adapter.enabled`** or **`--force`**. |
| **`npm run memory-sliding-summary`** | Build **`sliding-summary.md`** from a Claude Code JSONL transcript. |

Config merges **`config/memory.default.json`** → **`AGENTIC_SWE_MEMORY_CONFIG`** (path) → **`.agentic-swe/memory.json`** in the **target project**. Sliding options live under **`sliding.*`** (recent turn count, caps, output filename, LLM toggle).

## Session start (Claude Code, Cursor, and OpenCode)

| Variable | Role |
|----------|------|
| **`AGENTIC_SWE_HOOK_LIFECYCLE=0`** | Disable automatic indexing, reflection, and hygiene |
| **`AGENTIC_SWE_MEMORY_PRIME=0`** | Disable memory prime injection |
| **`AGENTIC_SWE_PROJECT_ROOT`** | Project root for indexing / prime (else hook **`cwd`**, else shell **`pwd`**) |
| **`AGENTIC_SWE_MEMORY_PRIME_QUERY`** | Default **`--query`** when not passed on the CLI |
| **`AGENTIC_SWE_WORK_DIR`** | If set to **`.worklogs/<id>`**, passes **`--work-id`** (basename) |

**Claude Code** uses **`hooks/hooks.json`**. **Cursor** uses **`hooks/hooks-cursor.json`** for both session start and stop. **OpenCode** runs the same maintenance from its plugin. VS Code and Codex include the hook scripts but do not execute them. Antigravity loads **`GEMINI.md`** only.

## Retrieval and embeddings

- Default **`prime.retrieval_mode`** is **`auto`**: use **hybrid** (lexical + semantic fusion) when embedding rows exist and a backend is configured; otherwise **lexical**.
- Optional backends: **`AGENTIC_SWE_EMBEDDINGS_BACKEND=test`** (CI/deterministic), **`ollama`**, **`openai`** — requires **`embeddings.enabled: true`** in merged config. See the [spec](https://github.com/agentic-swe/agentic-swe/blob/main/docs/specs/memory-graph.md). The same embedding stack is reused for **catalog semantic routing** ([Catalog routing](catalog-routing.md), [catalog-routing spec](https://github.com/agentic-swe/agentic-swe/blob/main/docs/specs/catalog-routing.md)).

## Related

- [Multi-platform support](multi-platform-support.md) — hooks and hosts
- [Usage](usage.md) — pipeline overview
- [Claude Code plugin](claude-code-plugin.md) · [Cursor plugin](cursor-plugin.md)
- Pack commands: **`commands/`** (install, work, check) — root **`CLAUDE.md`**
