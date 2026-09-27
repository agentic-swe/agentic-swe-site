# Google Antigravity

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host antigravity
```

Setup merges **`CLAUDE.md`**, copies **`GEMINI.md`** when that file is missing, installs the portable pack under **`.agentic-swe/`**, and merges workspace hooks into **`.agents/hooks.json`**.

- **PreInvocation** runs entry maintenance.
- **Stop** captures the transcript and evolves memory.

Install Antigravity itself from Google’s guide: [Get started](https://antigravity.google/docs/get-started).

Gemini CLI reads **`GEMINI.md`**. It does not use this Antigravity IDE hook contract. A Gemini CLI session is not proof that Stop capture ran.

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

Antigravity is **stable** when PreInvocation and Stop both run. Open the app repository, run a small task, and inspect **`.worklogs/<id>/`**. Stop at **`approval-wait`** before you merge.

## Advanced and recovery

Clone the pack and merge policy by hand only when setup cannot:

```bash
node scripts/merge-claude-policy.js --target /path/to/your-app
```

**`--gitignore`** appends **`.worklogs/`** when it is missing. Prefer **`agentic-swe repair`** or another **`setup --host antigravity`** before recreating **`.agents/hooks.json`** yourself.

When tool names differ from Claude Code, use **`references/*-tools.md`** in the pack, including **`references/gemini-tools.md`**.

## Related

- **[Antigravity](../antigravity.md)**
- **[Overview](/docs/installation#overview)** · **[Host capabilities](../host-support-tiers.md)** · **[Troubleshooting](../troubleshooting.md)**
