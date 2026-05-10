# Doubt-Driven Verification

A bounded, in-flight adversarial review protocol for non-trivial decisions. DDV catches wrong directions while course-correction is still cheap — before `/review`, before the PR, before production.

## When it triggers

A decision is **non-trivial** when at least one of these holds:

- Introduces or modifies branching logic
- Crosses a module or service boundary
- Asserts a property the type system cannot verify (thread safety, idempotence, ordering)
- Correctness depends on context the future reader cannot see
- Blast radius is irreversible (production deploy, data migration, public API change)

DDV is wired into `design-review`, `code-review`, and `validation` phases. You can also invoke it ad-hoc with the `/doubt` command.

## The five-step protocol

```
CLAIM → EXTRACT → DOUBT → RECONCILE → STOP
```

1. **CLAIM** — Name the decision in two or three lines. If you cannot write it compactly, you have a vibe, not a decision.
2. **EXTRACT** — Produce the smallest reviewable unit: the diff or function (artifact) plus the constraints it must satisfy (contract). Strip your reasoning.
3. **DOUBT** — Spawn a fresh-context reviewer with an adversarial prompt. Pass ARTIFACT + CONTRACT only. **Never pass the CLAIM** — handing the reviewer your conclusion biases it toward agreement.
4. **RECONCILE** — Classify each finding against the artifact text (not rubber-stamp):
   - **Contract misread** — fix the contract, re-classify next cycle
   - **Valid + actionable** — change the artifact, re-loop
   - **Valid trade-off** — document explicitly
   - **Noise** — note it, move on
5. **STOP** — when trivial findings only, 3 cycles completed, or user override.

## Anti-doubt-theater detector

If 2+ cycles produce substantive findings but zero are classified as actionable, the orchestrator is validating, not doubting. The pipeline **stops and escalates** immediately.

The `state.json.counters.doubt_cycles` counter tracks invocations with a hard cap of 3.

## Cross-model escalation

After a single-model doubt cycle, the Hypervisor offers cross-model review (Codex CLI, Gemini CLI, or manual paste). This catches blind spots that a single model shares with itself. See [Cross-model review](cross-model-review.md) for the full protocol.

## The `/doubt` command

```
/doubt <claim or artifact description>
```

Invoke DDV outside the normal phase flow — useful for ad-hoc decisions that don't map to a specific pipeline state.

## Why this matters

agent-skills (addyosmani) has the *idea* of doubt-driven development. agentic-swe makes it **enforced**: counter-capped at 3, classification log required, anti-theater detector, CI-checkable via `work-engine`. No other pack ships a doubt protocol that's both bounded and machine-validated.
