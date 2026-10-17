# DevPulse AI — visual and interaction direction

Status: implemented Phase 1 foundations; future workspace features below remain proposals.

## Implemented in Phase 1

Scoped `styles.css` under `.devpulse-root`, graphite/cyan palette, custom SVG wordmark, editorial landing and source-backed graph. Desktop workspace uses a 200 px sidebar and master/inspector columns; tablet stacks the inspector; mobile has an explicit navigation disclosure and a source jump link. No existing global portfolio selectors or theme settings changed.

System fonts avoid downloads. Body text is 12–14 px in technical workspaces; dense labels have an 11 px floor, source 12 px, and the hero scales from 34 px on narrow phones to 76 px. This adjusts the initial typographic proposal to the measured layout; review actual screenshots rather than assuming the earlier target sizes were implemented verbatim.

Landing graph is SVG plus semantic buttons; on mobile it becomes a module grid with explicit incoming/outgoing source links. The full architecture page lazily loads React Flow with custom nodes, arrowheads, cyan outgoing/amber incoming edges, dashed type imports and a searchable list alternative. Selection and highlighted lines persist in URL query parameters. Code viewer supports actual source text, token colors, line numbers, symbol selection, wrapping and clipboard feedback.

Implemented empty/error states include no module search results, invalid module URL, no graph selection, unknown route, lazy view loading, failed chunk load and failed clipboard access. No future routes are clickable. Screenshot/axe coverage and measured budgets are recorded in PROGRESS.md. Graph and source containers intentionally scroll; the page does not overflow horizontally at tested widths.

## Identity: an evidence workbench

The signature visual is an architecture diagram that can be traced into source evidence. A thin cyan path connects the selected module, its import relationship and its source range. This visual grammar also connects findings to explanations and patches. Use an original small branching-path mark made from SVG primitives; no brain/robot artwork, ambient blobs or 3D renderer.

Landing composition: compact product bar with portfolio return, large left-aligned statement, a restrained methodology caption, one primary “Explore sample repository” action, and a wide asymmetrical architecture canvas. Below it, use an editorial explanation of evidence → interpretation → review, not a grid of repeated marketing cards. No invented customer logos, impact percentages, finding counts or performance graphs.

## Tokens and typography

Scope all variables and selectors to `.devpulse-root`, use `--dp-*` names and CSS modules or prefixed classes. Do not alter `body`, `html`, root theme storage or existing global component styles. Scoped root sets color-scheme, background and readable selection; global smooth-scroll behavior needs local reduced-motion handling where applicable.

| Role | Proposed value |
| --- | --- |
| Background / surface / raised | `#101215` / `#171B20` / `#20262D` |
| Subtle separator / interactive boundary | `#303740` / `#697786` |
| Primary / secondary text | `#F2F5F7` / `#AAB5C1` |
| Active accent | `#61D6EE` |
| Warning / error / success | `#F2C66D` / `#F28B91` / `#86D3AC` |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64 px |
| Radius | 4 px controls, 8 px panels; no pill-shaped default containers |
| Reading width | 68 characters for explanation; technical panes may be dense |

Colors are design proposals; verify actual foreground/background pairs, focus indicators and graph edges before acceptance. Severity also uses text/icon labels; never color alone. Subtle separators are not sufficient as interactive boundaries.

Use locally hosted Inter (existing visual continuity) and IBM Plex Mono if license/asset review permits; system sans/monospace fallback. Do not block Phase 1 on remote fonts. Body 14–16 px with 1.5–1.6 leading, code 13–14 px, metadata 12 px minimum, display 40–72 px responsive. Use tabular numerals only for measured quantities. Avoid letter-spaced paragraphs and tiny all-caps text.

## Workspace composition

Desktop: 56 px product bar; approximately 216 px navigation rail; flexible main workspace; optional 320–400 px evidence inspector. Use resizable split panes later with keyboard alternatives. Repository identity and snapshot appear above the workspace; status line reports actual coverage/freshness.

Tablet: collapse rail to accessible navigation drawer, inspector becomes a selectable pane. Mobile 320–767 px: one primary pane at a time; list-first architecture with optional graph; finding → source → diff as explicit navigation steps. Never shrink a three-column workspace into a phone. Diff defaults to inline on narrow screens. Horizontal scrolling restricted to source/diff regions, not whole pages.

Core reusable primitives: navigation item, accessible button/link, labeled field, status badge, disclosure, evidence reference, source range, split-pane frame, empty/error notice, dialog and toast. Avoid premature general component frameworks. Existing Lucide and Framer Motion can be reused; React Flow and Monaco are lazy loaded only when their phase requires them. Recharts only for real measured series.

## Interaction contracts

- Selecting a graph node highlights only evidenced neighbors and opens the source inspector. Keyboard/list selection has equivalent content; drag/pan is optional, not required to understand architecture.
- Findings table supports severity, origin, verification and file filters. Detail shows the original tool observation before AI assessment, with separate evidence sections.
- Chat displays source references next to supported claims and an expandable retrieved-context list. No unexplained confidence percentages.
- Patch review exposes base snapshot, changed paths and validation matrix. “Accepted for export” never implies applied, merged or safe.
- Loading reserves layout space. Progress labels come from job stages, not arbitrary timed percentages. Empty graph is an explanation with supported next action, not fake nodes.
- Show unavailable features only in a clearly written roadmap, not as clickable empty product pages.
- Route transitions update document title, focus the heading appropriately, preserve browser back/forward and scroll restoration. Drawers/dialogs trap focus, close with Escape and return focus.

## Accessibility and performance acceptance

Target WCAG 2.2 AA; this is a target, not certification. Text contrast at least 4.5:1 for normal text, 3:1 for large text and meaningful UI boundaries; visible focus, semantic landmarks and skip link. Primary touch targets aim for 44 px. Test keyboard-only, screen-reader labels, 200% zoom, reduced motion, high contrast and 320 px viewport. Include a nonvisual graph representation. No serious/critical automated accessibility violations plus manual review of main journeys.

Phase 1 budget proposals: additional eagerly loaded portfolio JS at most 10 kB gzip; DevPulse landing route chunk at most 100 kB gzip excluding already-shared dependencies; loaded sample explorer feature chunks at most 180 kB gzip; scoped CSS at most 20 kB gzip. Monaco and full graph packages must not be in the portfolio entry. Account separately for existing 377.69 kB gzip entry: the new feature cannot claim a fast total experience merely by meeting its incremental budget.

Target LCP <=2.5 s, CLS <=0.1, INP <=200 ms when enough real measurements exist. During development record median of three cold-cache mobile-throttled runs on fixed viewport/browser/hardware; use scripted interaction traces before field INP exists. Existing entry weight may prevent targets; document measured failure and propose a separately reviewed narrow lazy-boundary optimization rather than refactoring the portfolio silently. Test 360/768/1440 px, screenshots of existing routes, and graph keyboard interactions. No performance figures have yet been measured beyond build sizes.

## Phase 2 private workspace

Projects reuse the graphite/cyan tokens and existing shell. Lazy `projects.css` scopes library rows, semantic forms, private identity bar, source metadata, diagnostic history and inline destructive-action confirmation. No scores or analysis claims. Mobile forms stack deliberately; project facts use two columns and job controls remain accessible. No new fonts, icons library or frontend runtime dependency.
