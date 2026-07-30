# Screenshots

This folder holds the real iOS screenshots referenced by the site.
The current set was refreshed from TuneSync 1.0.7 on July 30, 2026.
Locale-specific product shots live in `zh-CN/` and `en/`; shared shots
remain at the top level.

Recommended filenames (referenced across the site):

| File                        | Where it appears                          |
| --------------------------- | ----------------------------------------- |
| `{locale}/home.png`         | Homepage hero                             |
| `{locale}/library.png`      | Library showcase + docs                   |
| `{locale}/search.png`       | Search/discovery showcase + docs          |
| `{locale}/settings.png`     | Settings docs                             |
| `{locale}/recording-studio.png` | Recording Studio showcase + docs     |
| `player-lyrics.png`         | Player showcase + docs/player             |
| `karaoke.png`               | Karaoke showcase + docs/karaoke           |
| `ai-dj.png`                 | AI showcase + docs/ai                     |
| `lyrics.png`                | docs/lyrics                               |
| `metadata.png`              | docs/metadata                             |
| `getting-started.png`       | docs/getting-started                      |

## Capture tips

- Capture on the existing **iPhone 17** simulator in persistent mode.
- Keep the native portrait aspect ratio; the current source shots are
  `1206 × 2622`.
- Export as PNG with the status bar visible for authenticity.
- For dark mode variants, append `-dark` (e.g. `player-lyrics-dark.png`)
  and wire up conditional rendering in the relevant component if needed.

## How placeholders work

`PhoneMockup` and `ShowcaseSection` accept a `screenshot` prop. When the
prop is omitted, the placeholder is shown. To enable a real image, pass
the filename, e.g.:

```tsx
<ShowcaseSection screenshot="player-lyrics.png" ... />
```
