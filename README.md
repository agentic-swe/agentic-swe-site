# agentic-swe-site

Public documentation and marketing site for [**agentic-swe**](https://github.com/agentic-swe/agentic-swe), built with Vite + React.

- **Live site:** https://agentic-swe.github.io/agentic-swe/
- **Source pack / plugin:** https://github.com/agentic-swe/agentic-swe

## Local development

```bash
npm ci
npm run dev
```

## Publishing

The Pages workflow in [agentic-swe/agentic-swe](https://github.com/agentic-swe/agentic-swe/blob/main/.github/workflows/pages.yml) builds this repository's `main` with `VITE_BASE=/agentic-swe/` and publishes it at https://agentic-swe.github.io/agentic-swe/. It runs on every push to that repository's `main`, on manual dispatch, and on a 30-minute schedule that skips the deploy when this repository's `main` has not changed.

After merging here, publish immediately with:

```bash
gh workflow run pages.yml --repo agentic-swe/agentic-swe
```

This repository's own Pages serves only redirects: every old `https://agentic-swe.github.io/agentic-swe-site/...` URL forwards to the same path under `/agentic-swe/`, keeping the query string and `#hash`.

## License

MIT — same as the core repository.
