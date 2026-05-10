# Policy-as-Code

Organizations and repositories can publish typed policy files that merge with pack defaults, enforcing engineering standards through the pipeline rather than through documentation alone.

## Policy sources and precedence

Three layers, merged with **org > repo > pack default**:

1. **Pack default** — `config/default-policy.json` ships with agentic-swe
2. **Repo policy** — `.agentic-swe/policy.json` in the target repository
3. **Org policy** — pointed to by `AGENTIC_SWE_POLICY` environment variable

## What you can enforce

### Track rules

Force minimum track depth based on file patterns:

```json
{
  "track_rules": [
    { "pattern": "src/auth/**", "minimum_track": "rigorous", "reason": "Auth changes require full governance" },
    { "pattern": "*.sql", "minimum_track": "standard", "reason": "Schema changes need design review" }
  ]
}
```

### Mandatory subagents

Require specialist reviewers for sensitive areas:

```json
{
  "mandatory_subagents": [
    { "pattern": "src/payments/**", "subagent": "quality-security/security-auditor.md", "phase": "code-review" }
  ]
}
```

### Banned tools

Prevent specific tool combinations:

```json
{
  "banned_tools": [
    { "tool": "git push --force", "context": "main branch", "reason": "Protected branch" }
  ]
}
```

### Budget overrides

```json
{
  "budget_overrides": {
    "max_cost_usd": 10.0,
    "max_iterations": 15,
    "max_doubt_cycles": 5
  }
}
```

## Commands

- `/policy show` — display the effective merged policy
- `/policy explain <state>` — show what's enforced for a specific state
- `/policy check` — validate policy schema

## CI enforcement

`work-engine` reads the merged policy during `/check` commands. Invalid policies fail with structured errors — no aspirational documentation that CI cannot verify.

## Why this matters

Enterprises will not adopt autonomous agents without Policy-as-Code. agentic-swe is the **only open-source pack** with a typed policy layer that CI enforces deterministically.
