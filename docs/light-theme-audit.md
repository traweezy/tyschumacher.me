# Light theme and project previews

Reviewed 2026-09-08. This update covers the portfolio's selected-theme behavior
and authentic light captures for projects with a native light palette.

## Contrast

The shared primary button mixed selected-theme background tokens with Tailwind's
system-preference `dark:` text variant. With a dark operating system and light
portfolio preference, the contact button rendered dark text on cobalt: axe
measured **2.61:1**, below the **4.5:1** normal-text target. The opposite combination
could also leave white text on the dark palette's pale accent.

Primary buttons now use `--accent-contrast` and `--accent-hover`, alongside
`--accent`, in every state. The contact form's placeholders explicitly use
`--text-secondary` at full opacity. These changes reuse the existing palette.
The light hero eyebrow now uses the readable rose token. The obsolete
`data-theme="dark"` form selector was removed; this app uses `civic-light` and
`civic-dark`.

[Tailwind's dark-mode documentation](https://tailwindcss.com/docs/dark-mode)
confirms that the default `dark:` variant follows `prefers-color-scheme`. Shared
theme tokens avoid maintaining a second theme selector for these controls.

## Screenshot capture record

| Project | Light capture | Context |
| --- | --- | --- |
| Stackctl | `stackctl-light-4683191bb67e.webp`, 1600 × 1017 | Real TUI in Xterm using the native light palette and an isolated, deterministic `example` snapshot. Three example services; credentials remain masked. No service lifecycle commands or private configuration were used. |
| QuantHelm | `quanthelm-light-3b83007d432e.webp`, 1440 × 1000 | Public Railway `/demo`; selected its existing **Use light theme** control. Synthetic positions only. |
| Personal website | `personal-website-light-0a6a032272c8.webp`, 1440 × 820 | Local production homepage in headed Chromium, selected light theme. Includes the current layered skyline header and its native light palette. |
| Relantern | Existing `relantern.webp` | Public demo and source stylesheet currently implement a dark palette only. The authentic capture is retained in both portfolio themes. |
| Remorseless Records | Existing `remorseless-records.webp` | Staging catalog and source stylesheet currently implement a dark palette only. The authentic capture is retained in both portfolio themes. |

Browser captures were taken in headed Chromium. Stackctl uses its actual
`internal/tui` model at revision `090faa16e0cf8ac4606f811cf902da639dcec21d`, with a
scratch loader under the ignored `tmp/portfolio-capture/` directory. The native
model receives its normal background-color message with a light background and
runs in a real Xterm window; the screenshot is padded to the existing image
ratio. Its harness has no action runner. No tracked files in other project
repositories were changed. Screenshots were encoded as WebP; they were not
recolored or synthesized.

The portfolio dark capture is also refreshed as
`personal-website-dark-f9fefb413b65.webp`, at the matching 1440 × 820 size. Other
existing dark screenshots remain available. `Project.image.lightSrc` is optional
so projects without light themes keep a single authentic image.
Server-rendered alternate links use CSS keyed to `data-theme="civic-dark"`;
only the active image/link is visible, accessible, and keyboard focusable.
Full-size links open the matching capture. Intrinsic dimensions are equal for
each pair to avoid layout shifts. Next Image retains default lazy loading;
no client state, image preload, or dependency was added.

This follows the CSS visibility approach in the
[Next Image theme example](https://nextjs.org/docs/app/api-reference/components/image#theme-detection-css),
with this app's selected theme taking precedence over the operating system.
The browser regression checks that hidden light captures are not requested
before a switch from dark mode.

## Verification

Targets: all selected/system theme combinations pass automated WCAG A/AA checks;
primary-button normal and hover text contrast is at least 4.5:1; one visible
screenshot/link per project; no horizontal page overflow or theme-switch layout
shift; existing 80% coverage thresholds remain satisfied.

The new `e2e/theme-home.spec.ts` covers the four theme combinations, contact hover
contrast, loaded preview images, full-size links, switching, persisted preference,
and hidden-image requests. Existing suites cover no-JavaScript content, keyboard
navigation, responsive layouts, and reduced motion. Detailed final results are
recorded below.

Measured in headed Chromium against the production preview:

| Control | Light | Dark |
| --- | --- | --- |
| Primary button | 7.70:1 | 9.79:1 |
| Primary button on hover | 10.27:1 | 12.37:1 |
| Contact placeholder | 7.66:1 | 9.23:1 |

Rendered review covers contact normal/hover states, both portfolio captures,
Stackctl's native light TUI, QuantHelm's light demo, and project cards on desktop
and phone. The page has no horizontal overflow at 320, 390, 768, 1440, and 1920 px.
Before/after Flameshot desktop captures supplement the headed browser captures;
the browser connector reported no available browser. A later Flameshot attempt
timed out; the earlier successful after capture and browser captures were inspected.
Evidence is under `/tmp/portfolio-light-review/`.

Concurrent hero work introduced three background layers and static phone artwork.
That implementation was preserved; the obsolete single-image motion checks now
verify all three layers load, their ordered desktop travel, static phone behavior,
and live reduced-motion changes. Project layout and mobile tests now measure the
single accessible image in each card, excluding the hidden alternate capture.

Final gates passed:

- `pnpm check`, `pnpm typecheck`, and `pnpm build`.
- 94 unit tests in 29 files. Coverage: statements 89.27%, branches 84.00%,
  functions 90.42%, lines 89.51%.
- All 65 production browser tests across desktop, phone, tablet, Chromium,
  WebKit, dark preferences, and reduced motion (2.2 minutes).
- `pnpm audit --audit-level=moderate`: no known vulnerabilities.
- `pnpm run sbom`: CycloneDX inventory generated. No dependencies changed.
- `git diff --check` and final light/dark portfolio-card screenshots.

Concurrent test runs initially removed each other's shared trace files; an
interrupted runner also left an old preview server on its port. The final run
used a fresh port with server reuse disabled and separate report directories:

```sh
CI=true PLAYWRIGHT_HTML_OUTPUT_DIR=/tmp/portfolio-light-review/html-final \
  PORT=3232 pnpm test:e2e \
  --output=/tmp/portfolio-light-review/e2e-final --workers=2
```

This light-theme pass performed no live email submission. The subsequent
[parallax release review](parallax-hero-research.md) adds hero hover contrast
corrections and a Firefox fallback test, and records the final 66-test browser
run before the combined changes are committed and pushed.
