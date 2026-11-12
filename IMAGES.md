# Site image assets

Complete inventory of every image the site depends on, where it lives on disk, where it shows up in the UI, and what to drop in if you want to replace it.

> All paths below are relative to the site root. Build-time prefixing (the `/TuneSync-Site` base path on GitHub Pages) is handled by `src/lib/assets.ts` — you only ever write the bare path.

---

## Brand icons

| File                    | Size      | Used by                                        | Notes                                                                            |
| ----------------------- | --------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `public/logo-light.png` | 1024×1024 | `src/components/site/Logo.tsx` (light theme)   | Header + footer logo mark, shown via `<img>` with rounded corners (~22% radius). |
| `public/logo-dark.png`  | 1024×1024 | `src/components/site/Logo.tsx` (dark theme)    | Same as above, swapped automatically via `dark:hidden` / `dark:block`.           |
| `src/app/icon.png`      | 1024×1024 | Next.js App Router convention (`app/icon.png`) | Browser tab favicon + PWA icon. Next.js auto-wires it; no code reference needed. |

**Replacement tips:** square PNG with the full-bleed TuneSync mark (no inner padding), 1024×1024 minimum. The component applies its own corner radius and ring, so the source file should be flat-cornered.

## Social preview

`public/og.png` is the 1200×630 Open Graph / X card. It still uses the coral icon
treatment and the earlier waveform motif; regenerate it when the brand art is
next refreshed.

---

## Screenshots

All screenshots live in `public/screenshots/`. They are referenced by bare filename (e.g. `"home.png"`) from three components:

- `src/components/marketing/PhoneMockup.tsx` — phone-shaped frame on the homepage hero and feature rows
- `src/components/marketing/ShowcaseSection.tsx` — alternating feature rows (legacy template)
- `src/components/docs/DocContent.tsx` (`<ScreenshotPlaceholder>`) — every doc page

**Current capture:** TuneSync 1.0.32, November 2026, iPhone 17 simulator,
`1206 × 2622`, localized demo library. Source of truth:
`ios-native/TuneSync/fastlane/screenshots/_source/2026-11-03/phone/{en-US,zh-Hans}/`.
`en/` holds the English UI and `zh-CN/` the Simplified Chinese UI. See
`public/screenshots/README.md` for the exact scene → filename mapping.

| File                                          | Size      | Where it appears                                                                                                                         |
| --------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `public/screenshots/{locale}/home.png`        | 1206×2622 | Homepage hero (`Hero.tsx` → `PhoneMockup`). Highest-visibility shot.                                                                     |
| `public/screenshots/{locale}/library.png`     | 1206×2622 | `/features` Library row; `/docs/library`, `/docs/metadata`, `/docs/discovery`.                                                            |
| `public/screenshots/{locale}/sources.png`     | 1206×2622 | Homepage + `/features` sources row; `/docs/getting-started`, `/docs/settings`.                                                             |
| `public/screenshots/{locale}/player.png`      | 1206×2622 | Homepage + `/features` playback row; `/docs/player`.                                                                                      |
| `public/screenshots/{locale}/lyrics.png`      | 1206×2622 | Homepage + `/features` lyrics & karaoke row; `/docs/lyrics`.                                                                              |
| `public/screenshots/{locale}/recording.png`   | 1206×2622 | Homepage + `/features` sing & record row; `/docs/karaoke`.                                                                                |
| `public/screenshots/{locale}/recording-studio.png` | 1206×2622 | Homepage + `/features` Audio Studio row; `/docs/recording-studio`.                                                                   |
| `public/screenshots/{locale}/take-playback.png` | 1206×2622 | Homepage + `/features` play-it-back row.                                                                                                 |
| `public/screenshots/{locale}/search.png`      | 1206×2622 | Spare alias of the library capture (kept for compatibility).                                                                              |
| `public/screenshots/{locale}/settings.png`    | 1206×2622 | Spare alias of the sources capture (kept for compatibility).                                                                              |

Every doc page now pulls the locale-matched capture, so an English reader sees the English UI.
`/docs/ai` has no current capture and renders the grid placeholder instead — swap in a fresh
`public/screenshots/{locale}/ai.png` and point that page at it once one exists.

**Retired root-level captures** (1.0.7-era UI, no longer referenced anywhere; safe to delete
once you no longer need them for reference): `ai-dj.png`, `metadata.png`, `discovery.png`,
`settings.png`, `karaoke.png`, `lyrics.png`, `player-lyrics.png`, `getting-started.png`,
`getting-started-dark.png`, `home.png`, `library.png`.

### Capture / replacement specs

- **Device:** iPhone 17 simulator (matches the project's reference device).
- **Orientation:** portrait.
- **Resolution:** `1206×2622`. Anything with a 9:19.5 aspect ratio works because the phone frame crops to that ratio.
- **Format:** PNG (lossless, supports the colorful gradients used in the UI).
- **Status bar:** keep visible for authenticity. The phone frame draws its own bezel on top, so don't pre-mask the notch.
- **Use the uncomposed source captures.** The `fastlane/screenshots-v2/` posters already contain marketing headlines and would collide with the site's own headings.
- **Dark-mode variants:** append `-dark` to the filename (e.g. `home-dark.png`). Currently the components don't switch automatically — wire it up in `PhoneMockup.tsx` if needed.

### How the placeholder fallback works

`PhoneMockup`, `ShowcaseSection`, and `ScreenshotPlaceholder` all accept a `screenshot="<filename>"` prop. If the file is missing on disk, the component falls back to a tinted gradient block with the screenshot's label, so the page never breaks during development. Drop the real file into `public/screenshots/` with the exact name and it gets picked up on the next build — no code changes.

---

## Update workflow

1. Replace the file(s) in `public/screenshots/` or `public/` (keep the exact filename).
2. `pnpm build` to verify locally — open `out/index.html` or `pnpm dev` and click through the homepage, `/features`, and a few doc pages.
3. Commit and push to `master`. The deployment workflow rebuilds and ships automatically.

## Adding a brand-new image

1. Drop the file into `public/` (or `public/screenshots/` for screenshot-style assets).
2. Reference it in code via the `asset()` helper so the base path is applied:
   ```tsx
   import { asset } from '../../lib/assets'
   ;<img src={asset('/screenshots/my-new-shot.png')} alt="..." />
   ```
3. If it's a new screenshot slot in a doc page, also add a translation key for its `shot*` label in `i18n/messages/{en,zh-CN}.json` to keep both locales in parity.
