# Adaptive Track Router

An advisory system that recommends lean, standard, or rigorous track selection based on **past worklogs** in the repository. The longer a team uses agentic-swe, the smarter the routing becomes.

## How it works

1. At `lean-track-check`, after computing the heuristic verdict, the Adaptive Track Router (ATR) runs against completed `.worklogs/` entries.
2. ATR tokenizes the current `feasibility.md` and computes **TF-IDF cosine similarity** against completed worklogs' feasibility artifacts.
3. The top-K most similar completed worklogs vote on the track, weighted by similarity.
4. ATR returns a recommendation with confidence level and average cost from matched worklogs.

## Advisory, not authoritative

The recommendation is written to `state.json.pipeline.track_recommendation`:

```json
{
  "track_recommendation": {
    "track": "standard",
    "confidence": "high",
    "evidence_ids": ["work-abc123", "work-def456"],
    "avg_cost": 1.25,
    "reason": "Based on 3 similar completed worklogs"
  }
}
```

The Hypervisor still makes the final decision. ATR output is one input alongside the heuristic verdict.

## Override semantics

- **Agree with heuristic** — proceed with confidence
- **Disagree** — Hypervisor documents why it followed or overrode ATR in `lean-track-check.md`
- **No data** — fall back to heuristic only
- **Low confidence** — treat as informational

## Cold start

Repos with no completed worklogs get `{ track: null, confidence: "none" }`. The heuristic is the sole input. As worklogs accumulate, ATR becomes more useful.

## Privacy

ATR operates entirely locally. Feasibility text and cost data never leave the repository.

## Why this matters

Track selection becomes a **data product**, not a vibe. Repos accumulate intelligence — every completed work item makes the next one cheaper. No competitor offers cost-aware track routing learned from your own engineering history.
