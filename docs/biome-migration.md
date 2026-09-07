# Biome tooling

The portfolio uses Biome 2.5.12 for linting, formatting, import organization, and
utility class ordering. The version is pinned in `package.json` and the pnpm
lockfile. ESLint, Prettier, their plugins, and their configuration files have been
removed. TypeScript, Vitest, Playwright, and the security scanners retain their
separate responsibilities.

## Commands and editor integration

| Command | Purpose |
| --- | --- |
| `pnpm check` | Check formatting, lint rules, and import organization; fail on warnings. |
| `pnpm check:fix` | Apply formatting, import organization, and safe lint fixes. |
| `pnpm check:ci` | Run the same checks without writes in CI. |
| `pnpm format` | Format supported files. |
| `pnpm format:check` | Check formatting only. |
| `pnpm lint` | Check lint rules only; fail on warnings. |

The commit hook runs `pnpm check` and `pnpm typecheck`. Both GitHub and GitLab
quality jobs use `pnpm check:ci`. The pre-push coverage gate remains enabled.
The VS Code workspace recommends `biomejs.biome` and enables formatting and safe
fixes on save for JavaScript, TypeScript, JSX, TSX, JSON, JSONC, and CSS.

## Configuration and migration decisions

The [official migration command](https://biomejs.dev/guides/migrate-eslint-prettier/)
mapped 71 ESLint rules. `biome.json` preserves their active equivalents alongside
Biome's recommended rules and [React and Next domains](https://biomejs.dev/linter/domains/).
Warnings fail the checks, matching the former zero-warning policy. The migration
does not provide exact parity with every ESLint plugin, particularly React
Compiler diagnostics; the React Compiler remains enabled in the production build.

Formatting keeps two spaces, double quotes, semicolons, LF endings, and a 90-column
target. Imports use Biome's ordering, with side-effect import boundaries preserved.
Tailwind v4 directives and CSS Modules are parsed. Git ignores exclude generated
builds, coverage, reports, secrets, and TypeScript build state. The pre-existing
legacy cleanup script remains excluded, and the legacy SVG asset is preserved.
The old absolute symlink to the owner's global agent instructions is removed and
ignored so clean CI checkouts do not contain a broken machine-specific link.

`useSortedClasses` replaces the class-ordering plugin. This is a pinned nursery
rule with [documented limitations](https://biomejs.dev/linter/rules/use-sorted-classes/),
including custom utilities and variant ordering. It also checks `cn` and `clsx`.
Biome classifies its fixes as unsafe, so review its editor suggestions or run
`pnpm exec biome lint --write --unsafe --only=nursery/useSortedClasses .` and
inspect the diff. General safe fixes do not silently reorder these strings.

Stable Biome does not yet format Markdown or YAML, and HTML/SVG formatting remains
experimental. These files keep their existing manual formatting; there is no
second formatter. See the [language support table](https://biomejs.dev/internals/language-support/).

Narrow, explained suppressions retain the static CSP-protected theme scripts,
escaped structured data, the native image test double, and the reduced motion
overrides. Accessibility findings were addressed with semantic navigation and
popover containers and handlers on the actual filter buttons. Test assertions
now check nullable values at runtime.

## Local measurements

A single local run before migration took 0.998 seconds for formatting and 1.815
seconds for linting. After migration, the combined `pnpm check` took 0.110 seconds,
including pnpm startup. These are local observations, not a cross-machine benchmark.
The old tools and plugins account for 296 removed installed packages. This change
affects development tooling, not the production runtime dependency set.
