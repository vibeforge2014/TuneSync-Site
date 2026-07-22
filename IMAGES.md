# Site image assets

Complete inventory of every image the site depends on, where it lives on disk, where it shows up in the UI, and what to drop in if you want to replace it.

> All paths below are relative to `site/`. Build-time prefixing (the `/TuneSync` base path on GitHub Pages) is handled by `src/lib/assets.ts` — you only ever write the bare path.

---

## Brand icons

| File                    | Size      | Used by                                        | Notes                                                                            |
| ----------------------- | --------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `public/logo-light.png` | 1024×1024 | `src/components/site/Logo.tsx` (light theme)   | Header + footer logo mark, shown via `<img>` with rounded corners (~22% radius). |
| `public/logo-dark.png`  | 1024×1024 | `src/components/site/Logo.tsx` (dark theme)    | Same as above, swapped automatically via `dark:hidden` / `dark:block`.           |
| `src/app/icon.png`      | 1024×1024 | Next.js App Router convention (`app/icon.png`) | Browser tab favicon + PWA icon. Next.js auto-wires it; no code reference needed. |

**Replacement tips:** square PNG with the full-bleed TuneSync mark (no inner padding), 1024×1024 minimum. The component applies its own corner radius and ring, so the source file should be flat-cornered.

---

## Screenshots

All screenshots live in `public/screenshots/`. They are referenced by bare filename (e.g. `"home.png"`) from three components:

- `src/components/marketing/PhoneMockup.tsx` — phone-shaped frame on the homepage hero and AI section
- `src/components/marketing/ShowcaseSection.tsx` — alternating feature rows on the homepage and `/features`
- `src/components/docs/DocContent.tsx` (`<ScreenshotPlaceholder>`) — every doc page

| File                                          | Size      | Where it appears                                                                                                                         |
| --------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `public/screenshots/home.png`                 | 1206×2622 | Homepage hero (`Hero.tsx` → `PhoneMockup`). Highest-visibility shot.                                                                     |
| `public/screenshots/library.png`              | 1206×2622 | Homepage showcase row 1 (`[locale]/page.tsx`), `/features` Library row (`features/page.tsx`), `/docs/library` (`docs/library/page.tsx`). |
| `public/screenshots/player-lyrics.png`        | 1206×2622 | Homepage showcase row 2, `/features` Playback row, `/docs/player`.                                                                       |
| `public/screenshots/karaoke.png`              | 1206×2622 | Homepage showcase row 3, `/features` Karaoke row, `/docs/karaoke`.                                                                       |
| `public/screenshots/ai-dj.png`                | 1206×2622 | Homepage showcase row 4, `/features` AI row, `/docs/ai`, AI section phone mockup (`AISection.tsx`).                                      |
| `public/screenshots/metadata.png`             | 1206×2622 | `/features` Metadata row, `/docs/metadata`.                                                                                              |
| `public/screenshots/discovery.png`            | 1206×2622 | Homepage showcase row 5, `/features` Discovery row, `/docs/discovery`.                                                                   |
| `public/screenshots/lyrics.png`               | 1206×2622 | `/docs/lyrics` only.                                                                                                                     |
| `public/screenshots/settings.png`             | 1206×2622 | `/docs/settings` only.                                                                                                                   |
| `public/screenshots/getting-started.png`      | 1206×2622 | `/docs/getting-started` only.                                                                                                            |
| `public/screenshots/getting-started-dark.png` | 1206×2622 | **Currently unreferenced** — kept for a future dark-mode variant of the getting-started page. Safe to delete if unused.                  |

### Capture / replacement specs

- **Device:** iPhone 17 simulator (matches the project's reference device in `ios-native/TuneSync/AGENTS.md`).
- **Orientation:** portrait.
- **Resolution:** the existing files are 1206×2622 (≈ iPhone 15/17 Pro @ ×3). Anything with a 9:19.5 aspect ratio works because the phone frame crops to that ratio.
- **Format:** PNG (lossless, supports the colorful gradients used in the UI). JPEG also works but banding can show on dark backgrounds.
- **Status bar:** keep visible for authenticity. The phone frame draws its own bezel on top, so don't pre-mask the notch.
- **Dark-mode variants:** append `-dark` to the filename (e.g. `home-dark.png`). Currently the components don't switch automatically — if you want dark variants to render, wire it up in `PhoneMockup.tsx` / `ShowcaseSection.tsx`.

### How the placeholder fallback works

`PhoneMockup`, `ShowcaseSection`, and `ScreenshotPlaceholder` all accept a `screenshot="<filename>"` prop. If the file is missing on disk, the component falls back to a tinted gradient block with the screenshot's label, so the page never breaks during development. Drop the real file into `public/screenshots/` with the exact name and it gets picked up on the next build — no code changes.

---

## Update workflow

1. Replace the file(s) in `public/screenshots/` or `public/` (keep the exact filename).
2. `pnpm build` to verify locally — open `out/index.html` or `pnpm dev` and click through the homepage, `/features`, and a few doc pages.
3. Commit and push to `master`. The `deploy-site.yml` workflow rebuilds and ships to GitHub Pages automatically.

## Unreferenced / safe-to-delete

- `public/screenshots/getting-started-dark.png` — not referenced anywhere in `src/`.

## Adding a brand-new image

1. Drop the file into `public/` (or `public/screenshots/` for screenshot-style assets).
2. Reference it in code via the `asset()` helper so the base path is applied:
   ```tsx
   import { asset } from '../../lib/assets'
   ;<img src={asset('/screenshots/my-new-shot.png')} alt="..." />
   ```
3. If it's a new screenshot slot in a doc page, also add a translation key for its `shot*` label in `i18n/messages/{en,zh-CN}.json` to keep both locales in parity.
