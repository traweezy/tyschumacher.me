# Mobile and tablet audit

Date: September 6, 2026. Baseline: `b33413c`.

## Scope and acceptance criteria

The audit covers the header, hero, all five projects and expanded engineering
notes, experience filters, skills, contact validation and success, footer,
navigation drawer, command search, external links, and resume downloads.

Acceptance criteria: no horizontal content loss at 320 CSS pixels, no overlapping
header controls, all menu actions reachable in portrait and landscape, usable
search with reduced viewport height, stable space for unloaded project images,
and no automated WCAG A/AA violations in the tested light, dark, form error, and
modal states. The 320 px reflow and target checks follow the W3C guidance for
[reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and
[target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Findings and fixes

| Area                    | Observed problem                                                                                                                 | Result                                                                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tablet header           | Desktop links overlapped the name and utility buttons around 961–1024 px. Contact could not be tapped.                           | Use the compact navigation below 80rem. Check control bounds, intersections, and hit targets across ten breakpoints. Close an open drawer when entering the desktop layout.           |
| Short navigation drawer | The last resume link ended around 723 px on a 360 px tall screen. The drawer could not scroll and had no internal close control. | Keep a close button above a separately scrolling link area, with dynamic viewport height and safe area padding.                                                                       |
| Search                  | The dialog exceeded a short viewport and had no visible dismissal control.                                                       | Constrain the dialog to available height, scroll results independently, and provide Close and Clear controls. Follow visual viewport changes when the keyboard reduces visible space. |
| Project screenshots     | Lazy images could occupy zero height before loading, shifting everything below them.                                             | Preserve their intrinsic aspect ratios and correct the responsive image sizes at tablet widths. A delayed-image test checks all five placeholders.                                    |
| Contact fields          | Input text was below 16 px. Validation errors became part of the accessible field names.                                         | Use 16 px inputs with explicit names and associated labels. Keep validation messages in the described-by relationship.                                                                |
| Error contrast          | Light-theme error text measured 3.32:1 on white.                                                                                 | Use separate light and dark error tokens; both error states pass the contrast audit.                                                                                                  |
| Narrow header           | The identity link was only about 16 px tall, and the name competed with the action buttons.                                      | Give the identity a larger target, use 44 px phone buttons, and tighten spacing on the narrowest screens.                                                                             |

Search uses the [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
because an onscreen keyboard can reduce the visual viewport without resizing the
layout viewport. Listeners exist only while search is mounted and are removed
when it closes. The CSS dynamic viewport fallback remains available.

## Coverage and evidence

The rendered width sweep includes 320, 360, 390, 430, 600, 640, 641, 744, 768,
820, 900, 960, 961, 980, 1024, 1194, 1280, and 1366 px. Short landscape views
include 640 × 360. Search also receives a simulated 300 px visual viewport.
Project cards and the main page sections were inspected in both Chromium and
WebKit. Real desktop screenshots were captured with Flameshot before and after
the header and drawer fixes.

The browser suite contains 53 tests, including Android/Chromium, iPhone/WebKit,
iPad/WebKit, and tablet landscape/Chromium profiles. It covers pointer taps,
keyboard navigation, drawer dismissal and rotation, search filtering and clearing,
image and destination links, downloads, expanded project content, filters, and
contact feedback. Contact submissions are intercepted by the tests and send no
email. The existing desktop, reduced motion, no-JavaScript content, metadata,
security-header, and 404 tests remain part of the suite.

WebKit runs against a local HTTPS proxy so the production
`upgrade-insecure-requests` policy is exercised without modification.
`e2e/https-preview.ts` binds only to loopback, creates a one-day self-signed
certificate in a temporary directory using OpenSSL, and removes it on shutdown.
The browser context accepts that local certificate; production certificate
validation is unchanged. No certificates or keys are checked in.

## Reproduction and limits

Install the pinned Chromium and WebKit binaries with
`pnpm exec playwright install chromium webkit`, then run `pnpm build` and
`pnpm test:e2e`. OpenSSL must be available for the local TLS proxy. Playwright
starts HTTP on `PORT` (3000 by default) and HTTPS on the next port. Reports and
failure screenshots are retained as CI artifacts.

This is browser emulation plus rendered desktop inspection, not a physical
iPhone or iPad test. Native keyboard behavior, device-specific browser chrome,
screen-reader behavior, and mobile network performance still benefit from a
physical-device check. The automated keyboard test exercises visual viewport
resize events rather than displaying an operating-system keyboard. See
[Playwright's emulation scope](https://playwright.dev/docs/emulation).
