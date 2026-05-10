# Cross-model review

The fourth axis of the design panel. While the existing panel runs architect, security, and adversarial reviewers within the same model, cross-model review invokes an **external model CLI** (Codex, Gemini) to catch blind spots that a single architecture shares with itself.

## How it works

1. After a single-model review (doubt cycle or panel review), the Hypervisor offers cross-model escalation.
2. The user picks a CLI (Codex, Gemini), manual paste, or skip.
3. The pipeline probes the CLI (`which`, `--version`), writes the adversarial prompt + artifact + contract to a temp file, and invokes via **stdin piping** — never inline arguments.
4. Output is reconciled using the same classification precedence as DDV (contract-misread / actionable / trade-off / noise).

## Safety properties

These are **load-bearing**, not optional:

- **Sandbox-read-only**: the external CLI must not write to the workspace. Artifact content may contain instructions (intentional or accidental prompt injection) that the CLI would otherwise execute.
- **Per-invocation authorization**: each invocation requires explicit user confirmation of the exact command. Authorization does not carry across invocations.
- **stdin piping only**: never interpolate artifact content into shell-quoted arguments. Code and markdown routinely contain backticks, `$(...)`, and quote characters.

## Invocation examples

```bash
# Codex (read-only sandbox):
codex exec --sandbox read-only -C <repo-path> - < /tmp/ddv-prompt.md

# Gemini (read-only approval mode):
gemini --approval-mode plan -p "" < /tmp/ddv-prompt.md
```

## Fallback hierarchy

1. User's preferred CLI
2. Codex CLI (sandbox-aware by design)
3. Gemini CLI
4. Manual paste (user copies artifact to another tool)
5. Skip (announced, not silent)

## Non-interactive contexts

In CI, `/loop`, or autonomous runs, cross-model is **skipped** and the skip is **announced**: "Cross-model skipped: non-interactive context." Never invoke an external CLI without explicit user authorization.

## Why this matters

Devin, OpenHands, SWE-agent, and aider all ship single-model verdicts. agentic-swe ships a **policy-driven, sandbox-aware cross-model panel** with a CI-validated invocation envelope. This is the single most credible "no hallucination slips past us" claim in the space.
