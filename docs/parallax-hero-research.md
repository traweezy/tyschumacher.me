# Layered parallax hero: research and release review

Audience: Tyler Schumacher and site maintainers. Reviewed September 8, 2026.

The three-layer approach is suitable after correcting its depth ordering, hover
contrast, narrow-phone coverage, and asset weight. The original uncommitted
implementation needed these fixes before release. The accompanying
[research report](../output/pdf/layered-parallax-review.pdf) records the evidence
and measurement limits.

## Depth and timeline

For a non-sticky plane, viewport position is document position minus scroll plus
its animated translation. Positive translation compensates for upward scrolling:
the distant plane needs the largest compensation. The earlier ordering made the
skyline move slowest on screen. The corrected model is:

| Plane | Content | Downward compensation | Screen movement |
| --- | --- | --- | --- |
| Backdrop | Sky, clouds, horizon, water | `clamp(22rem, 40vw, 36rem)` | Slowest |
| Technology | Constellation, stars, buffalo | `clamp(10.5rem, 18vw, 18rem)` | Intermediate |
| Skyline | City Hall, grain elevators, reflections | `clamp(2.5rem, 5vw, 5rem)` | Fastest artwork plane |

This follows the geometry described by [Chrome's Performant Parallaxing](https://developer.chrome.com/blog/performant-parallaxing/)
(Paul Lewis and Robert Flack, updated December 2, 2016). Its historical Safari and
Edge workarounds are not used. Text and controls retain ordinary document motion.

The hero's view timeline uses `exit-crossing 0%` through `100%`, avoiding the old
65% early stop. `view-timeline-inset: 0` separates animation progress from root
anchor-navigation scroll padding. The [CSSWG working draft](https://drafts.csswg.org/scroll-animations-1/#view-timeline-inset)
(May 14, 2026) defines the inset and range behavior. `animation-timeline` follows
the animation shorthand so the shorthand cannot reset it.

The stronger-motion adjustment increases backdrop travel fourfold, technology
travel threefold, and skyline travel twofold. At 1440px, full compensation is
576 / 259.2 / 72px. The target is at least 200px of backdrop compensation during
a 350px scroll at that width, with the artwork continuing upward on screen and
covering the visible scene. The initial crop and full exit range stay the same.

At 1440 × 900, a measured 350px Chromium scroll increased compensation from
59.5 / 35.7 / 14.9px to 237.3 / 106.8 / 29.7px. Backdrop-to-skyline separation
increased from about 45px to 208px, making the depth easier to see. Header
condensation also affects absolute viewport travel. Existing regression tests
assert viewport ordering, live motion preferences, and return to the start pose.
This adjustment adds no JavaScript, dependencies, or image payload. Before/after
captures and measurements are under `/tmp/stronger-hero-parallax/` locally.

## Rendering, accessibility, and art direction

The scene uses three nonfocusable CSS-background spans in one `aria-hidden`
container. Pointer events pass through. The supported enhancement animates only
transforms; it adds no JavaScript scroll loop, animation dependency, or
`will-change` hint. [Chrome's scroll-animation case study](https://developer.chrome.com/blog/scroll-animation-performance-case-study/)
(updated July 12, 2023) supports this implementation choice, but does not prove
this particular scene's GPU memory use or frame rate. Blending and raster size
still have costs.

Static styles are the default. Motion requires both CSS timeline/range support
and OS `prefers-reduced-motion: no-preference`; the synchronized internal
`data-motion="reduce"` state also prevents it. There is no separate user-facing
motion toggle. Phones at 600px or narrower remain static. This follows
[W3C technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
(updated January 12, 2026). Interaction-triggered parallax is discussed in
[SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html),
a AAA criterion; this review does not claim complete WCAG conformance.

Light mode uses the independently relit morning composition; dark mode uses the
blue-hour composition. Directional scrims support foreground readability.
Light hero hover surfaces now use theme tokens: the two CTA contrasts improved
from 1.28:1 and 1.25:1 to 9.67:1 and 13.99:1. The existing automated theme matrix
also checks hero hover and keyboard focus.

Wide, tablet, and phone crops retain separate focal compositions. The original
positive mobile background offsets exposed a strip at 320px. The shifts are now
capped at zero, preserving top coverage while retaining the intended offsets
where the crop has enough overscan. Real before/after screenshots confirm this.

## Asset delivery

CSS `image-set()` prefers AVIF with WebP fallback, inside a feature query that
retains the plain WebP declaration for older engines. Theme and breakpoint
variables select the appropriate composition. See [MDN image-set](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/image/image-set)
(live reference, accessed September 8, 2026) for format selection.

| Theme / crop | Original three WebPs | Three AVIFs | Three fallback WebPs |
| --- | --- | --- | --- |
| Light / wide | 2,568,434 bytes | 429,479 bytes | 1,258,798 bytes |
| Dark / wide | 1,510,282 bytes | 340,950 bytes | 640,686 bytes |
| Light / mobile | 1,136,904 bytes | 218,949 bytes | 532,928 bytes |
| Dark / mobile | 747,434 bytes | 191,232 bytes | 336,170 bytes |

The comparison is against the reviewed uncommitted layers, not the previous
single-image Next.js delivery. Desktop light payload falls 83.3%; phone light
payload falls 80.7%. Source widths are 3200 / 2160 / 1200px for wide / tablet /
phone. Encoding uses the installed Next.js Sharp dependency: AVIF quality 50,
effort 3; WebP quality 78, alpha quality 95, effort 5. Assets are committed outputs;
no runtime conversion or new dependency is required. All three planes in a crop
share dimensions. Chromium cold request records showed three active AVIF assets
without fetching the hidden theme or WebP alternatives.

Background discovery still follows CSS application. [Google's LCP guidance](https://web.dev/articles/optimize-lcp)
(Philip Walton and Barry Pollard, updated March 31, 2025) identifies this as a
potential delay. No broad preload was added: a persisted app theme can differ
from the OS, making an OS-only preload fetch the wrong composition. Use production
Web Vitals to decide whether a preload coordinated with the resolved theme is
necessary. The old single-image 300KB target is historical; the measured active
three-plane totals above describe this implementation.

## Verification

- `pnpm check`, `pnpm typecheck`, and `pnpm build` pass.
- 94 unit tests pass in 29 files; coverage is 89.27% statements, 84.00% branches,
  90.42% functions, and 89.51% lines.
- All 66 browser tests pass in 2.5 minutes, including the added Firefox static
  fallback, Chromium/WebKit desktop/tablet motion, phone artwork, theme matrix,
  hover/focus, live reduced-motion changes, and project preview behavior.
- `pnpm audit --audit-level=moderate` reports no known vulnerabilities;
  `pnpm run sbom` generates the production CycloneDX inventory.
- Both themes were measured from 320 to 2560px, including breakpoint edges,
  without horizontal overflow. Rendered screenshots were inspected at selected
  phone, tablet, desktop, and wide sizes, plus WebKit and Firefox states. Headed
  Chromium and real Flameshot desktop captures supplement automated checks.
- Cold-cache local HTTPS Chromium smoke tests used 6 Mbps download, 150ms latency,
  and 4x CPU throttling. Three light-theme LCP samples were 1.644 / 1.472 / 1.520s
  at 390px and 1.812 / 1.740 / 1.756s at 1440px; all six CLS values were zero.
  These are synthetic local samples, not field percentiles or physical-device
  benchmarks. A request-interception comparison was discarded because it bypassed
  emulated image transfer.

The first hosted run passed all 65 Chromium/WebKit checks, but Firefox refused
to launch because Actions mounted `/github/home` with `pwuser` ownership while
the container job ran as root. The workflow now aligns that existing directory's
ownership with the job user before launching browsers. It does not change the
home environment variable or disable Firefox's safety checks.

The browser run uses isolated output paths and a fresh production server:

```sh
CI=true PLAYWRIGHT_HTML_OUTPUT_DIR=/tmp/parallax-review/html \
  PORT=3244 pnpm test:e2e --output=/tmp/parallax-review/e2e --workers=2
```

Local evidence is under `/tmp/parallax-review/`. Firefox's installed default
configuration rendered the complete static scene; the dedicated regression also
forces the timeline feature off. WebKit rendered the animated tablet/desktop
composition. Engine support does not eliminate edge cases; [Safari 26.5's release
notes](https://webkit.org/blog/17938/webkit-features-for-safari-26-5/)
(Jen Simmons, May 11, 2026) include view-timeline boundary fixes.

The generated layers derive from the approved composite, with raster masks rather
than original photographic/vector layers. Extreme zoom and very high-density
screens can expose softness. Low-end physical-device frame rate, GPU memory, and
production field metrics were not established by this review. Further broad
research would not resolve those device-specific measurement gaps.
