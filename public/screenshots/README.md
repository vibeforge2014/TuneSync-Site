# Screenshots

This folder holds the iOS screenshots referenced by the site. The current set
was refreshed from the **TuneSync 1.0.32 / November 2026** capture
(`ios-native/TuneSync/fastlane/screenshots/_source/2026-11-03/phone/`), taken
on the iPhone 17 simulator at 1206 × 2622 with a localized demo library.

Locale-specific shots live in `en/` (English UI) and `zh-CN/` (Simplified
Chinese UI). Historically both folders contained the same Chinese capture;
they now carry their own localized screenshots. Shared shots at the top level
use the Chinese capture, which matches the site's default locale.

## Scene → filename mapping

The source capture has seven scenes. Each is copied into the site under the
filename the components expect:

| Source scene                 | `en/` and `zh-CN/` filename    | Where it appears                              |
| ---------------------------- | ------------------------------ | --------------------------------------------- |
| `01Library.png`              | `home.png`, `library.png`, `search.png` | Hero, library row, `/docs/library`, `/docs/discovery` |
| `02Sources.png`              | `sources.png`, `settings.png`  | Sources row, `/docs/settings`                 |
| `03Player.png`               | `player.png`                   | Playback row                                  |
| `04Lyrics.png`               | `lyrics.png`                   | Lyrics & karaoke row                          |
| `05Studio.png`               | `recording-studio.png`         | Audio Studio row, `/docs/recording-studio`    |
| `06Recording.png`            | `recording.png`                | Sing & record row                             |
| `07RecordingPlayback.png`    | `take-playback.png`            | Play-it-back row                              |

Shared top-level shots used by the docs:

| File                        | Source scene (zh-Hans)        | Where it appears       |
| --------------------------- | ----------------------------- | ---------------------- |
| `player-lyrics.png`         | `03Player.png`                | `/docs/player`         |
| `karaoke.png`               | `06Recording.png`             | `/docs/karaoke`        |
| `lyrics.png`                | `04Lyrics.png`                | `/docs/lyrics`         |
| `getting-started.png`       | `02Sources.png`               | `/docs/getting-started`|

`ai-dj.png`, `metadata.png`, `discovery.png` and `getting-started-dark.png`
are older doc-only captures of screens that were not part of the November 2026
capture. They are not used by the landing page or `/features`; replace them
when fresh captures of those exact screens are available.

## Capture tips

- Capture on the **iPhone 17** simulator in persistent mode.
- Keep the native portrait aspect ratio; the source shots are `1206 × 2622`.
- Export as PNG with the status bar visible for authenticity. The phone frame
  draws its own bezel, so don't pre-mask the notch.
- Use the uncomposed `_source/.../phone/` captures, **not** the composed
  `fastlane/screenshots-v2/` posters: the latter already contain marketing
  headlines and would collide with the site's own titles inside the phone frame.
- For dark mode variants, append `-dark` and wire up conditional rendering in
  `PhoneMockup.tsx`.

## How placeholders work

`PhoneMockup` and `ShowcaseSection` accept a `screenshot` prop. When the
prop is omitted, a placeholder gradient is shown. To enable a real image,
pass the filename, e.g.:

```tsx
<ShowcaseSection screenshot="player-lyrics.png" ... />
```
