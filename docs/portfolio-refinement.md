# Visual and content refinement

The current header and timeline presentation is documented in [the header and timeline audit](hero-timeline-audit.md). It supersedes the profile card and chronology styling described below.

Research and audit completed on 2026-09-06 before implementation. Changes remain local pending publication approval.

## Direction and evidence

The portfolio now uses warm paper and ink surfaces, avatar-inspired cobalt and rose accents, color-coded technology chips, the existing serif display type, descriptive headings, grouped skills, and visible icons with text. The goal is to make the role, relevant work, and supporting source easier to find.

This direction draws on current first-party portfolios: [Brittany Chiang](https://brittanychiang.com/) for explicit role and curated evidence, [Paco Coursey](https://paco.me/) for concise linked projects, [Lee Robinson](https://leerob.com/) for editorial clarity, and [Josh W. Comeau](https://www.joshwcomeau.com/about-josh/) as an example of personality alongside substantive work. These are observed design examples, not evidence that one visual style causes better hiring outcomes.

Descriptive headings and consistent grouping follow [NN/g’s scanning research](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) (Kara Pernice, August 2019). Reduced visual competition follows its [visual hierarchy principles](https://www.nngroup.com/articles/principles-visual-design/) (Kelley Gordon, March 2020). The content and link audit reflects [credibility research](https://www.nngroup.com/articles/trustworthy-design/) (Aurora Harley, May 2016); those findings concern general website use, not specifically engineering recruitment.

## Changes

- Clear “Software engineer” positioning replaces an unverified Principal title. The hero offers projects, contact, résumé, GitHub and LinkedIn links with icons. Repeated principle cards were removed.
- “Skills” is directly available in navigation and search. Twenty-three tools sit in four groups: languages/interfaces, backend/APIs, messaging/live systems, and delivery/observability. Seven engineering priorities remain separate.
- Added gRPC, Apache Kafka and Grafana as requested. “gRNC” was interpreted as gRPC. Redis, NATS, Podman, Spring Boot, OpenTelemetry, WebSockets and server-sent events are supported by the inspected project sources. The list makes no proficiency, certification or employer-specific claims.
- Every skill and project technology has an icon and a visible label. Source and staging links have distinct icons; private-source labels and full screenshot links are explicit. New technology icons use named imports from the existing [Lucide React](https://lucide.dev/guide/react) package, under its [ISC license](https://lucide.dev/license). These are semantic illustrations, not new vendor logos or endorsement claims.
- Adjacent SVGs are decorative and hidden from assistive technology, consistent with [W3C guidance](https://www.w3.org/WAI/tutorials/images/decorative/). Text remains visible; no meaning depends only on color or an icon.
- The experience list uses a simple chronology with dates beside each role. Removed the timeline library, its types, and associated styling. Location filtering remains keyboard accessible.
- Lab49 and Twisted Rope role names now match the downloadable résumé. Lab49 copy describes collaboration with Java backend teams. Employment dates are preserved. Tailwind was removed from the role ending June 2017 because its [first release](https://github.com/tailwindlabs/tailwindcss/releases/tag/v0.1.0) was November 1, 2017.
- Contact wording now directly addresses hiring and project inquiries. Footer links include visible labels; undefined footer color variables were corrected. Favicons, app icons and browser theme colors match the refined palette.
- Reduced-motion settings suppress theme and decorative transitions throughout the interface. Existing native project disclosures, no-JavaScript content, security boundaries and share metadata are retained.

## Content boundaries

The downloadable résumé and existing portfolio are the source for employment history; this was not an independent employment verification. New skills are not retroactively attributed to an employer. Current project claims, work-in-progress status, screenshot provenance and preview/source availability are documented in [the project audit](portfolio-audit.md). No adoption metrics, performance improvements or live demos were invented.

The original social preview remains a readable 1200 × 630 PNG with the same name and headline. LinkedIn’s cached result and production mail delivery still require the post-approval deployment checks in the README.

See [verification](verification.md) for local test and rendered-review results.

## Recent-project bento follow-up

The owner preferred colored chips and the bento layout and requested newer GitHub work. The final selection is Stackctl, Remorseless Records, Relantern, QuantHelm and the personal website, with authentic screenshots for every project and no separate “More projects” list. Shared chip hues now apply to skills, project technologies and experience/domain tags. Release and work-in-progress labels are visible before opening engineering notes. Preview environment labels distinguish Remorseless staging, the live website with a local redesign preview, Stackctl’s installable releases, and Relantern and QuantHelm’s public illustrative/synthetic demonstrations. See the updated [project evidence and capture record](portfolio-audit.md).

The final scroll review added root scroll padding so native navigation and project detail targets remain clear of the sticky header.

## Avatar palette follow-up

The original avatar was inspected directly before this adjustment. Its cobalt hair and background, rose hat, dark ink, cream and yellow details inform the palette. Cobalt remains the primary action and link color; rose highlights the hero eyebrow, contact label and small surface accents. Yellow appears only in decorative rules, never as small text. Light mode uses warm paper surfaces; dark mode retains ink surfaces with lighter cobalt and rose for legibility. Technology chips retain their distinct hues and text/icon labels. The profile card adds a narrow cobalt/rose/brass rule, echoed in the favicon and app icons.
