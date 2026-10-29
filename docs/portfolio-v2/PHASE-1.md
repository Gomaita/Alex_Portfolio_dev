# Portfolio V2 — Phase 1

## Implemented

- Experimental `/newindex` (also accepts a trailing slash), with a lazy-loaded page.
- Independent layout, navigation, hero, selected work, tools, about, contact and footer.
- English copy, white surfaces, muted blue accents, subtle glass and responsive CSS Modules.
- Keyboard focus, skip link, semantic sections, reduced-motion handling including anchor scrolling.
- Route-owned title, description, robots, canonical, social title/description/URL and theme color. Previous values are restored on unmount, including during React StrictMode cleanup.
- Three repository-backed projects: InboxFlow AI, NutriCore and SQL Query Playground. Their descriptions explicitly identify demo behavior and limitations. Previews are labeled workflow illustrations, not screenshots or live results.
- Existing `/portfolio` and `/contact` remain the catalog and contact destinations.

## Decisions

- Keep the existing Home, shared navigation/footer, 3D, DevPulse, Functions, storage, sitemap and dependencies unchanged.
- Keep content data separate from sections and presentation. The page has no dependency on `/newindex` for section navigation; the route mount and canonical are the migration points.
- Use CSS/SVG compositions rather than remote media, new libraries or embedded running applications. Nothing calls project APIs from the new Home.
- Use existing React Router and Lucide; no dependency additions or configuration changes.
- CSS animations are small and finite; reduced motion disables them and hover transforms.

## Verification and limits

Static review only. No npm, Node, build, dev server, Wrangler, install, commit, push or deployment was run. Check relative imports, CSS references, anchors and existing project routes using PowerShell; check the tracked diff for whitespace errors. Browser rendering and runtime metadata restoration still require manual validation.

Robots metadata is client-side, set at the route boundary before the lazy page renders. Existing server middleware still returns the original metadata in raw HTML. A server-level noindex response is a future prerequisite if exclusion must also cover clients that do not execute JavaScript; no existing endpoints or deployment configuration were changed in this phase. This route is not password protected.

The contact route and submit handler exist in the repository; live message delivery was not tested. Existing projects keep their current presentation and language. Preview artwork is intentionally illustrative.

## Manual review

1. Open `/newindex` directly and with a trailing slash. Check 320, 390, 768, 1024 and 1440 px widths, and 200% zoom.
2. Check every anchor, project link, catalog link and contact link. Use Tab and visible focus, including the skip link.
3. Check reduced motion, including changing the preference while the route is open.
4. Inspect metadata on entry, on exit to `/`, `/portfolio` and `/contact`, and with browser Back/Forward.
5. Confirm the original Home, 3D and DevPulse retain their existing appearance, including after visiting V2 with the existing dark theme enabled.
6. Run the build manually; visual and runtime checks have not been claimed as passing.

No new configuration is required. The next phase should follow visual approval: refine the identity, then build a dedicated V2 catalog and project details. A V2 contact and Home migration remain later work.

## Files

- Modified: `src/App.jsx` (route boundary only).
- Added: `src/features/portfolio-v2/PortfolioV2Route.jsx`, `pages/HomePage.jsx`, `data/content.js`, `components/Navigation.jsx`, `components/ProjectPreview.jsx`, `sections/Hero.jsx`, `sections/SelectedWork.jsx`, `sections/Tools.jsx`, `sections/About.jsx`, `sections/Contact.jsx`, `styles/Portfolio.module.css`.
- Added: this phase record.
- Pre-existing edits in `docs/devpulse/DECISIONS.md` and `docs/devpulse/PROGRESS.md` are unrelated and preserved.
