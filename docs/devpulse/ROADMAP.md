# DevPulse AI — implementation roadmap

Status: Phase 0 and Phase 1 implemented locally. Phases 2–9 are pending. Phases are dependency gates, not promised dates. Do not advance automatically beyond the phase the user requests.

## Phase 1 closeout

The three routes, source fixture, scoped design/motion system, interactive pan/zoom architecture explorer, source inspector, route metadata, targeted quality gates and CI definition are implemented. React Flow was included at the user's explicit Phase 1 request; Prism replaces Monaco for read-only inspection. No API, authentication, import or AI capability was added. See PROGRESS.md for executed checks and limitations; production deployment and the LCP target remain unverified/unmet respectively.

Next: Phase 2 only upon instruction. Implement local FastAPI/Pydantic service, Postgres/SQLAlchemy/Alembic migrations, OIDC/session integration, project ownership/CRUD, Redis/RQ job ledger/outbox and cancellation/recovery tests, plus the typed frontend API contract. Do not add source ingestion or model calls until Phase 3/4 gates. Select identity provider before shipping authentication; local fake identity must be test-only. No provisioning/deployment without explicit approval.

## Dependency order

`0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9` is the main delivery order. Security tests, observability fields and evaluation fixtures begin with their corresponding features; Phase 7 consolidates measurement, and Phase 8 adds integrations/hardening. Neither is permission to defer safety or evidence. Phase 6 isolated test execution has its own infrastructure gate; patch applicability/syntax can work before tests are available.

| Phase | Deliverable and dependencies | Exit evidence / limitations |
| --- | --- | --- |
| 0 — audit and plan | Inspect current repository, routes, deployment evidence; create product/architecture/design/security/evaluation documents | Documentation, clean baseline record, explicit unknowns; no product implementation |
| 1 — visual foundation | Depends on 0. Scoped TS feature, isolated lazy routes, responsive shell, landing, sample overview/architecture with source inspector, meaningful motion, accessibility; narrowly scoped metadata integration | Visitor completes sample journey, deep links/refresh, old-route regression checks, TS/lint/build/UI tests and bundle measurements; no backend/import/chat/patch claims |
| 2 — backend foundation | Depends on 1. FastAPI/Pydantic modules, SQLAlchemy/Alembic, Postgres, Redis/RQ, local Docker Compose, OIDC sessions/project roles, typed client/OpenAPI, project CRUD, job/outbox/lease/cancel skeleton | Authenticated create/list/delete project end-to-end; isolation of users, migrations, restart/retry/idempotency tests, safe health; provider choice and dev identity config resolved |
| 3 — real ingestion and static analysis | Depends on 2 plus runner isolation. Public GitHub-only fetch/limits, immutable snapshots, secret filtering, Tree-sitter inventory/import graph, Ruff/Semgrep/trusted ESLint, normalized evidence, real history/status UI | Import a permitted fixture repo → tools → findings/source; hostile URL/archive tests, duplicate/retry/cancel tests, clear unsupported coverage; no repository code execution |
| 4 — retrieval and assistant | Depends on 3, provider consent/budget, first evaluation corpus. Exact+lexical+graph baseline, measured optional embeddings/pgvector, provider abstraction, structured answers/citation validator, bounded LangGraph only if justified | Ask → retrieved context → grounded answer/abstention, missing credentials/errors handled honestly; held-out retrieval/citation results and privacy tests |
| 5 — AI auditing | Depends on 3 and 4. Correlate static findings, AI maintainability/architecture assessment, source-backed prioritization, deduplication and review feedback | Static observations and AI assessments separately attributed; false-positive rubric, confidence calibration notes, regression fixtures; no verified vulnerability claim without evidence |
| 6 — Fix Studio | Depends on 3–5. Bounded patch generation, Monaco diff, accept/reject/export, exact-base applicability, syntax/static validation, optional isolated regression tests | Stale/path-unsafe patches rejected; all validation states visible, approvals recorded; tests remain not_run until stronger runner passes gate; no remote writes |
| 7 — operations and evaluation UI | Depends on recorded execution metadata since 2–4. Restricted traces, Langfuse optional adapter, model/token/cost reporting, versioned datasets/prompts and quantitative result pages | Real trace for a run; no private data in visitor mode; missing usage remains unknown; reproducible eval commands and honest failure denominators |
| 8 — GitHub App, ZIP and hardening | Depends on 2/3 security foundation and 7 auditability. Selected-repo read-only installation, signed webhooks, bounded ZIP uploads, incremental commit history, retention/deletion, quotas and operational hardening | Revoked installations blocked, webhook replay deduped, malicious archives rejected, purge/recovery evidence; remote writes still absent unless separately scoped |
| 9 — release readiness and case study | Depends on all enabled feature gates. Full cross-route regression, security/performance/accessibility review, deployment-mode reconciliation, staging validation, backup restore, runbooks and portfolio case study | User-approved deployment only after reviewable artifacts/checks; production smoke tests, measured case study, explicit remaining limitations and rollback procedure |

## Exact manageable Phase 1 scope

### Deliver

1. Add TypeScript compiler/config and compatible TS lint support, with strict checks for `src/features/devpulse/`; preserve existing JS. Add only the testing dependencies needed for meaningful UI and E2E verification. Versions must be verified at implementation time.
2. Register lazy `/devpulse/*` using the existing BrowserRouter, with its own shell, skip link, titles, focus management, local NotFound and explicit return to portfolio. Keep `/3d` and portfolio route behavior intact.
3. Build `/devpulse`, `/devpulse/explore`, `/devpulse/explore/architecture`. Landing uses the original evidence-path identity. Overview displays real counts from the bundled fixture. Architecture supports select, highlight and source inspection with a keyboard-equivalent list. A small SVG graph is sufficient for the <=20-node fixture; defer React Flow until real repository navigation requires it.
4. Bundle a first-party small source fixture and a documented structural manifest with file hashes and evidenced imports. Validate consistency with tests; label it as a local sample, not a stored live scan. Read-only source viewer uses lightweight `<pre>` with line numbers; defer Monaco to Phase 6.
5. Implement scoped design tokens, desktop/mobile navigation, empty/error handling where applicable, reduced-motion-aware transitions and no continuous ambient motion. No dormant clickable menu for future features.
6. Add only a narrowly scoped DevPulse metadata branch to existing middleware; set landing canonical to `https://alexgl.dev/devpulse`, deliberate sample metadata/indexing, preserve existing route metadata. No deployment config migration.
7. Add build/typecheck/scoped-lint/test CI configuration without push or deployment automation. Exclude local PortableGit from lint traversal as a narrowly justified tooling correction if touched; keep the 39 existing project errors visible and do not rewrite unrelated demos.
8. Execute relevant tests, browser refresh checks, old-route smoke/screenshots, accessibility review and bundle/performance measurement. Update all affected guidance and progress with actual outcomes.

### Exclude

No Python service, database, login, live import, uploads, provider calls, simulated chat, invented findings, fake traces, patch generation, remote repository writes or new hosting. No redesign of home, Navbar, Footer, existing demos or project cards. A visible portfolio project listing can be added in a later case-study phase when the product is functional; the Phase 1 return link establishes navigation coherence.

### Likely change boundary

New `src/features/devpulse/**`, scoped TypeScript/test configuration and tests; targeted `src/App.jsx`, `functions/_middleware.js`, `package.json`/lockfile and ESLint changes. `.github/workflows/` for checks only. No existing D1 schema, API handlers, theme storage or Cloudflare deployment settings changed. This is a proposal, not changes made in Phase 0.

## Per-phase completion protocol

Update PROGRESS with date, baseline/branch, functionality, exact changed-file inventory, executed checks/exit status, unmet gates, limitations and required user configuration. Update DECISIONS when trade-offs change. Link evidence and next phase. Stop rather than describing planned screens as delivered. Keep public claims aligned with implemented and measured behavior.
