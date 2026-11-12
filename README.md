# TuneSync site

The marketing site + user documentation for TuneSync, built with
**Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + next-intl**.
Bilingual (简体中文 / English), dark mode, fully static-exportable.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000  (served from "/")
```

To preview the production static export locally:

```bash
STATIC_EXPORT=true pnpm build
cd out && python3 -m http.server 8080
# open http://localhost:8080/zh-CN/
```

## Deploy to Cloudflare Pages

Deployment is automated via `.github/workflows/deploy-pages.yml`. Every push
to `master` (or a manual `workflow_dispatch`) runs:

1. Installs deps with `pnpm install --frozen-lockfile`
2. Builds with `STATIC_EXPORT=true` (static export to `out/`, without a base path)
3. Uploads `out/` to the `tunesync-site` Cloudflare Pages project using
   `--branch=master`, the project's production branch

The production site is [tunesync.zensoft.top](https://tunesync.zensoft.top/),
with [tunesync-site.pages.dev](https://tunesync-site.pages.dev/) as the Pages URL.
Check the workflow result and both addresses after deployment.

### Repository secrets

The workflow uses `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from
GitHub Actions secrets. The token needs permission to deploy to Cloudflare Pages.

The legacy GitHub Pages script remains available through `pnpm deploy`, but is
not the production publishing path. Sub-path exports can still use
`BASE_PATH=/TuneSync-Site pnpm build` when needed.

## Structure

```
src/
├── app/[locale]/            # localized routes (zh-CN, en)
│   ├── page.tsx             # home
│   ├── features/            # feature deep-dives
│   └── docs/                # product guides, including Audio Studio
├── components/
│   ├── site/                # Header, Footer, LangSwitcher, ThemeToggle
│   ├── marketing/           # Hero, FeatureGrid, Showcase, PhoneMockup
│   └── docs/                # Sidebar, DocsArticle, Callout/Steps/etc.
├── lib/assets.ts            # basePath-aware asset URLs
i18n/
├── routing.ts               # locales: zh-CN (default), en
└── messages/{zh-CN,en}.json # all copy lives here
public/screenshots/          # current iPhone 17 product screenshots
```

## Screenshots

Product screenshots are checked in under `public/screenshots/`, with
locale-specific marketing shots in `zh-CN/` and `en/`. See
`public/screenshots/README.md` for the current inventory.
