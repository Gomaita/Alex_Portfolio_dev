# Repository audit — 2026-10-16

## Evidence and boundaries

Repository inspected locally at baseline `27ccf5d` (`Add Groq model fallback for InboxFlow AI`), initially on `master` with clean tracked/untracked Git status. Created local branch `codex/devpulse-phase-0`. No existing AGENTS.md found in the repository or checked ancestor directories. `.agents/` exists with no files returned by recursive enumeration.

Inspected tracked structure; package/lock/config files; App/main routing; global CSS and representative shared components; frontend configuration/services/theme; Functions middleware/auth/API structure and AI handlers; D1 schema/migration; README and deployment, backend, security and QA documentation. This is an integration audit, not a line-by-line security review of every demo.

Cloudflare dashboard, account bindings, secrets, DNS configuration, Git integration settings, remote CI history, backend runtime logs and database contents were not accessible/inspected. No authenticated production API calls or writes were made. Local ignored environment secrets were not read. Browser-rendered behavior, accessibility and visual regressions were not tested in Phase 0.

## Actual frontend

Single npm package, ESM JavaScript/JSX, React DOM root and StrictMode, Vite with React and Tailwind Vite plugins. `src/main.jsx` owns one BrowserRouter; `src/App.jsx` uses declarative Routes. No TS compiler/configuration currently exists. ESLint targets JS/JSX only.

| Dependency | Manifest range | Lockfile version |
| --- | --- | --- |
| React / React DOM | ^19.2.6 | 19.2.6 |
| React Router DOM | ^7.15.1 | 7.15.1 |
| Vite | ^8.0.12 | 8.0.14 |
| React Vite plugin | ^6.0.1 | 6.0.2 |
| Tailwind / Tailwind Vite | ^4.3.0 | 4.3.0 |
| Framer Motion | ^12.40.0 | 12.40.0 |
| Lucide React | ^1.16.0 | 1.16.0 |
| Recharts | ^3.8.1 | 3.8.1 |
| ESLint | ^10.3.0 | 10.4.0 |

Installed baseline build reports Vite 8.0.14. Local Node is 24.16.0; npm 11.13.0. These are observations, not a verified production runtime pin. Scripts: dev=`vite`, build=`vite build`, lint=`eslint .`, preview=`vite preview`.

Styling uses `src/index.css` with Tailwind 4 `@import`, custom dark variant, extensive global components and feature-prefixed CSS. `tailwind.config.js` has legacy JS/JSX content globs; no explicit `@config` reference was observed in the CSS. Do not assume this file drives Tailwind 4 scanning; verify TSX discovery in Phase 1. Theme hook modifies the root `.dark` class and persists `alex-portfolio-theme`.

Shared Navbar/Footer wrap standard pages; `/3d` has a separate route branch. `ui/Section` reexports `layout/Section`; PageHeader also exists in both groups. Buttons/cards carry portfolio-specific colors and rounded surfaces. Reuse accessibility patterns and existing icon/motion dependencies, not these visual defaults. Existing API client is gated by portfolio environment flags and an eight-second timeout; DevPulse needs its own client and job semantics.

## Existing frontend routes to preserve

- `/`, `/portfolio`, `/portfolio/:slug`, `/about`, `/contact`.
- `/cheatsheets`, `/cheatsheets/:slug`.
- `/ai-operations-studio`, `/ai-support-intelligence`, `/ai-chat`, `/ai-message-processor`.
- `/nutricore`, `/security-lab`, `/blockchain-lab`.
- `/3d`, `/3d/projects`, `/3d/projects/:slug`, `/3d/contact`, `/3d/admin`.
- Catch-all NotFound. `/software` appears in metadata logic, but is not a React route; do not invent it as an existing page.

Three AI demo routes use lazy imports; much of the rest is eagerly imported. No existing `devpulse` route/module was found.

## Backend and persistence already present

Pages Functions under `functions/api/`: contact, project-submissions, projects/public, health, metrics, weather/search and current, crypto/markets and history, ai-chat, ai-message-processor; admin contact/submission handlers; public and admin 3D projects, publication/featured actions and uploads.

`functions/_utils/` provides validation, sanitization, response envelopes, admin auth, IDs, audit, email and feature helpers. D1 `DB` is used for `project_submissions`, `contact_messages`, `audit_logs`, `admin_settings`, `portfolio_3d_projects`; SQL and one 3D/R2 migration live in `db/`. R2 uses `MEDIA_BUCKET` and `MEDIA_PUBLIC_BASE_URL`. Contact notifications use Resend. Existing AI endpoints reference `AI_PROVIDER`, `AI_MODEL`, `AI_API_KEY`, `AI` binding, and InboxFlow `GROQ_API_KEY` / `GROQ_MODEL`. Presence of references does not establish configured production providers.

Admin authorization is a shared `ADMIN_API_TOKEN` bearer comparison. The 3D admin UI stores the entered token in sessionStorage. Educational auth demos are not real identity or project authorization. Do not inherit these mechanisms for DevPulse.

## Deployment discrepancy and direct navigation

`docs/DEPLOY_CHECKLIST.md` describes Cloudflare Pages, root build `npm run build`, output `dist`, `functions/`, Git-based deployment. `public/_redirects` contains `/* /index.html 200`; no top-level public 404.html found. Vite has no custom base.

However, `wrangler.jsonc` uses a Workers static-assets shape (`assets.directory=./dist`, SPA not_found_handling), name `alexportfoliodev`, compatibility date 2026-06-02. It has neither a Pages `pages_build_output_dir` nor D1/R2 bindings. `wrangler.example.toml` is a separate reference with a placeholder D1 binding. Wrangler is not a declared dependency. These files do not prove which product currently serves production; do not deploy or migrate based on inference.

Read-only HTTP probes on 2026-10-16:

| URL | Status | Result |
| --- | --- | --- |
| `https://alexgl.dev/` | 200 | HTML with root element, portfolio title/canonical |
| `https://alexgl.dev/devpulse` | 200 | Same SPA shell, canonical `https://alexgl.dev/` |
| `https://alexgl.dev/devpulse/explore/architecture` | 200 | Same SPA shell, canonical `https://alexgl.dev/` |

This verifies server delivery for direct nested GETs, not a working DevPulse screen or browser refresh E2E. Current React routing falls through to NotFound. Future lazy `/devpulse/*` routes can use the existing fallback without changing the root asset base. Test nested refresh in a real browser and a Pages-compatible local environment in Phase 1, then in an explicitly approved preview before release.

Global `functions/_middleware.js` rewrites HTML title, canonical and OG metadata. Unrecognized routes receive homepage metadata. Add a narrowly scoped DevPulse branch in Phase 1; retain other metadata behavior. Root middleware may influence Functions invocation routing. Do not blindly exclude `/devpulse/*` from Functions, or metadata handling may disappear. Workers assets mode does not automatically establish that Pages Functions are deployed.

Cloudflare documents [SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Functions routing](https://developers.cloudflare.com/pages/functions/routing/) and the distinction involved in [Pages-to-Workers migration](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/). These support the routing plan, not confirmation of account configuration.

## Baseline checks actually executed

- `npm run build`: exit 0. Main JS 1,321.73 kB / 377.69 kB gzip; main CSS 184.40 kB / 28.16 kB gzip. Warning for chunks above 500 kB. Ignored `dist/` regenerated; no source edits.
- `npm run lint`: exit 1, 419 errors and 3 warnings. ESLint also traverses ignored-by-Git local PortableGit documentation.
- Follow-up local ESLint JSON inspection on `src`, `functions`, vite/eslint/tailwind configs: ESLint exit 1, 39 errors and 3 warnings. Existing errors include hook effects, unused variables and caught-error handling. The reporting wrapper exited 0; this does not mean ESLint passed.
- No tracked automated tests, test scripts or `.github` workflows found. Existing manual checklist and in-demo evaluation logic do not constitute CI or reproducible DevPulse evaluation.
- Git clean at start; no application source/configuration changed by this phase. No dependency install, push, deployment or provisioning.

## Integration risks

Global CSS/theme leakage; eager initial bundle; missing TS/test foundation; lint baseline; inconsistent deployment descriptors; middleware metadata; no multi-user auth; new API origin/CORS; future parser/tool resource abuse; secrets in source sent to AI/tracing. Mitigations and release gates are in ARCHITECTURE.md, SECURITY.md and ROADMAP.md.
