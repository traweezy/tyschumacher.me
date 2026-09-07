# Header, timeline, and professional presentation audit

Reviewed September 6, 2026. This follows the mobile/tablet and Biome audits.

## Design and implementation

The supplied `Pictures/header.webp` is copied intact to `public/header.webp`.
The hero uses a dark palette in either site theme, with a horizontal text scrim
on desktop and a vertical fade on phones and portrait tablets. Responsive crops
keep Buffalo City Hall visible. The mobile composition gives the skyline space
above the introduction. The original artwork is not redrawn or altered.

The background moves more slowly than the foreground through a native CSS view
timeline. Travel is capped between 144 and 256 CSS pixels, depending on viewport
width. Only the image layer moves; text, controls, and normal document scrolling
remain unchanged. The timeline uses `exit-crossing`, so tall phone heroes respond
before their bottom edge enters the viewport. This follows the [named timeline
range definitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/timeline-range-name).

Motion is disabled for both the system reduced-motion preference and the app's
reduced-motion state. Browsers without the required CSS timeline/range features
show the same static composition. This follows [W3C guidance for interaction
animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
No animation dependency or JavaScript scroll loop was added.

The hero image is preloaded through Next Image. Its responsive `sizes` accounts
for a wide source being cropped into a taller image layer, avoiding an undersized
phone image. Explicit stylesheet dimensions preserve layout under the site's
strict inline-style CSP. See [Next Image's sizing guidance](https://nextjs.org/docs/app/api-reference/components/image#sizes).

“At a glance” is removed. The introduction retains direct project/contact
buttons, resume download, professional profile links, and location. Page,
desktop navigation, mobile navigation, and command search now follow:
Home → Experience → Projects → Skills → Contact.

Experience uses a continuous rail with date markers, a current-role badge, and
the existing color-coded technology chips. Filtering retains chronological DOM
order and correctly ends the rail for a single result. On smaller screens,
dates move above the cards while the rail remains on the left. Existing career
claims and the one-page resume content are preserved.

## Issues caught during visual review

| Finding | Correction |
| --- | --- |
| Inline image sizing was blocked by CSP, leaving a thin strip. | Move required image positioning and dimensions into CSS; browser tests compare image and layer bounds. |
| A hero taller than the viewport delayed the first parallax motion. | Use the `exit-crossing` range and test at 320 × 568. |
| The first motion range was too subtle. | Increase visible separation and assert meaningful image travel while retaining a slower background. |
| Narrow crops initially requested a low-resolution image. | Request enough source detail for the cropped layer. |
| Selected location text disappeared on hover. | Preserve selected foreground contrast and add explicit keyboard focus outlines; run accessibility checks in both themes with the pointer on the selected filter. |
| Section links combined two anchor offsets. | Retain the shared header scroll padding and remove the duplicate section margin. |
| The website's project screenshot showed the former hero. | Replace it with a current production-build browser capture and update its dimensions and alternative text. |

## Acceptance criteria and verification

Targets: no horizontal content overflow from 320 to 2560 CSS pixels; no critical
or serious accessibility findings; readable controls in both themes; no image
layout shift; parallax disables immediately when motion preferences change;
hero image delivery below 300 KB; LCP below 2.5 seconds and CLS below 0.1 in the
local smoke run. Local measurements are not production field percentiles.

Verification results are recorded in `docs/verification.md`. Automated checks
cover real Chromium and WebKit phone/tablet profiles, the expanded hero motion
cases, filter behavior, keyboard navigation, downloads, project previews, share
metadata, contact validation with mocked delivery, and reduced motion.

Real headed Chromium windows were operated and captured with Flameshot, then
inspected for crop, wrapping, contrast, focus, timeline alignment, and menu
reachability. Local before/after and section screenshots are under
`/tmp/portfolio-hero/`; they are review artifacts, not repository assets.
