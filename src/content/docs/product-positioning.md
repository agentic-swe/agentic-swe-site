# Product fit

Agentic SWE is a local workflow pack for coding agents. You install it into a repository you control. The session follows **`CLAUDE.md`**, writes evidence under **`.worklogs/<id>/`**, and stops at human gates. There is no hosted runner in this project.

A short evaluation sheet is [Who this is for](adoption-one-pager.md). A first run is the [Golden path](golden-path.md).

## When it fits

It fits people who already work in a coding agent and want:

- phased work instead of one unbounded chat
- budgets and stops for ambiguity and approval
- files a reviewer can open (**`state.json`**, phase notes, an audit log)
- the same policy on more than one host, with the limits in [Host capabilities](host-support-tiers.md)

That includes a team sharing one repository and a person using it on their own projects.

## When it does not fit

- You need a cloud service that clones repositories and ships changes without a local session.
- You need the same slash-command interface on every editor this week. Command discovery differs by host.
- You need an attested compliance product, ticket sync, or a multi-tenant control plane from this repository.
- You need every chat transcript captured inside generic VS Code, or inside Copilot IDE chat. Those surfaces do not provide that lifecycle. See [Durable memory](durable-memory.md).

## What you are choosing

You are choosing local governance: tracks, **`/check`** commands, and a work engine that rejects a transition the active track does not allow when that check runs. You are also choosing local memory that updates on the normal session lifecycle and stays advisory.

You are not choosing a second model vendor. Prompts still go to the host you already use.

## Next

- [Installation](/docs/installation#overview)
- [Privacy](privacy.md)
- [Licensing](licensing.md)
