# Glossary

Short definitions for the public docs. Behavior and limits are on the linked pages.

**Advisory memory.** The digest injected at session start. It can inform the session. **`state.json`** and repository files win when they disagree.

**Approval wait.** A human gate after a pull request exists. The pipeline stops until you resume.

**Ambiguity wait.** A human gate when the task is too unclear to continue. You answer, then resume.

**Hook notice.** **`.agentic-swe/hook-notice.md`**. Written when a lifecycle step fails, then injected into the next session.

**Hook receipt.** One JSON line in **`.agentic-swe/hook-receipts.jsonl`** for a lifecycle run. Use it to see what ran and what failed.

**Hook trust.** Codex’s approval before repository or plugin hooks may execute. Untrusted hooks do not maintain memory.

**Host.** The coding product where the session runs: Claude Code, Cursor, OpenCode, Codex, Antigravity, Windsurf, Kiro, Copilot, VS Code, or an instruction-only editor.

**Human gate.** A required stop. The session does not treat the change as finished while the work item sits on that state.

**Hypervisor.** The primary session that owns transitions, gates, and the written artifacts. Specialist agents do bounded tasks. They do not own **`state.json`**.

**Lifecycle.** Session start and session stop maintenance: index changed markdown, refresh lessons and style, score transcripts when the host provides them, quarantine bad procedures, write a receipt.

**MCP fallback.** Memory tools for hosts without a lifecycle API. Refresh, prime, and status run only when the host or the agent calls them.

**Memory prime.** The bounded markdown digest produced from the local index and injected by default. Disable with **`AGENTIC_SWE_MEMORY_PRIME=0`**.

**Partial host.** Maintenance runs, but agent transcript capture is missing or inconsistent. VS Code and Copilot IDE chat are the current cases.

**Procedure.** A stored verify command in **`.agentic-swe/procedures.json`**. Malformed and duplicate procedures are quarantined and are not replayed.

**Restricted Mode.** A Windsurf setting. While it is on, Cascade hooks do not run, so this pack’s lifecycle does not run.

**Stable host.** Start and stop both run, and the adapter’s transcript lifecycle is available. Trust and Restricted Mode still apply where those products require them.

**Track.** Lean, standard, or rigorous. The feasibility step sets **`pipeline.track`**. Allowed transitions depend on that track.

**Work item.** One task’s folder, **`.worklogs/<id>/`**, including **`state.json`**, **`progress.md`**, and **`audit.log`**.

## Related

- [Installation](/docs/installation#overview) · [Host capabilities](host-support-tiers.md) · [Durable memory](durable-memory.md) · [Usage](usage.md)
