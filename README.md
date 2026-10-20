# agentic-swe-site

Public documentation and marketing site for [**agentic-swe**](https://github.com/agentic-swe/agentic-swe), built with Vite + React.

- **Live site:** https://agentic-swe.github.io/agentic-swe/
- **Source pack / plugin:** https://github.com/agentic-swe/agentic-swe

## Local development

```bash
npm ci
npm run dev
```

## Blog

Posts are markdown files in `src/content/blog/<slug>.md`, registered newest first in `src/blog/posts.js` (slug, title, date, description). The build emits a page for each post, adds it to `sitemap.xml`, and writes the RSS feed to `rss.xml`.

## Build-time options

All are optional; leave them unset and the build behaves as before. Set them in the environment or a local `.env.local`.

| Variable | Effect |
|---|---|
| `VITE_PLAUSIBLE_DOMAIN` | Adds the cookieless [Plausible](https://plausible.io/data-policy) script with this `data-domain` to every page. |
| `VITE_PLAUSIBLE_SRC` | Script URL for a self-hosted or proxied Plausible. Defaults to `https://plausible.io/js/script.js`. |
| `VITE_WAITLIST_FORM_ACTION` | Formspree-compatible endpoint the `/waitlist` form posts to. |
| `VITE_WAITLIST_EMAIL` | Used only when no form endpoint is set: the form opens a `mailto:` to this address. |

With neither waitlist variable set, `/waitlist` shows the tier copy and says sign-up is not open yet.

## Publishing

The Pages workflow in [agentic-swe/agentic-swe](https://github.com/agentic-swe/agentic-swe/blob/main/.github/workflows/pages.yml) builds this repository's `main` with `VITE_BASE=/agentic-swe/` and publishes it at https://agentic-swe.github.io/agentic-swe/. It runs on every push to that repository's `main`, on manual dispatch, and on a 30-minute schedule that skips the deploy when this repository's `main` has not changed.

After merging here, publish immediately with:

```bash
gh workflow run pages.yml --repo agentic-swe/agentic-swe
```

This repository's own Pages serves only redirects: every old `https://agentic-swe.github.io/agentic-swe-site/...` URL forwards to the same path under `/agentic-swe/`, keeping the query string and `#hash`.

## License

MIT — same as the core repository.
