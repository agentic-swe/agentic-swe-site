# OWAI specification

**Open Work-item Interchange** (OWAI) is an open standard for representing the lifecycle of an autonomous software engineering work item. agentic-swe is the reference implementation.

## Why a spec?

Autonomous coding agents produce work — but the work's state, evidence, and governance are locked inside proprietary formats or ephemeral chat sessions. OWAI provides a common contract so:

- Teams can **audit** agent work after the fact
- Tools can **produce and consume** work items interchangeably
- CI systems can **enforce** pipeline rules without tool-specific plugins
- Training data pipelines can **ingest** structured engineering traces

## Conformance levels

| Level | Name | What it means |
|---|---|---|
| **L1** | Read | Can parse a conformant work directory and extract state, history, and artifacts |
| **L2** | Read + Write | Can produce conformant work directories that pass schema validation |
| **L3** | Enforce | Can validate transitions, budgets, and artifact requirements against the state machine |

## Work directory structure

A conformant work directory:

```
<work-dir>/
  state.json          # Current state, pipeline, budgets, history
  progress.md         # Human-readable progress log
  audit.log           # Append-only trail with actor attribution
  <artifact>.md       # Phase artifacts (feasibility.md, design.md, ...)
```

## Key fields in state.json

- `schema_version` — integer (currently 2)
- `work_id` — unique identifier
- `current_state` — pipeline state
- `budget` — iteration budget, remaining, cost in USD
- `counters` — bounded loop counters
- `pipeline` — track, complexity, flags
- `history[]` — ordered transition entries with `artifact_hashes` (sha256 per artifact)

## Conformance runner

```bash
node scripts/owai-conformance.cjs <work-dir> --level L3
```

The runner validates schema, artifact existence, budget integrity, and history chain consistency.

## Extensibility

Tools may add custom fields under a namespaced `x_*` key. Conformance validation ignores these.

## Why this matters

Specs win wars. By being the **author of the standard**, agentic-swe becomes infrastructure, not just a product. Compare to how the OpenAPI spec made Swagger durable — the spec outlived the tool.
