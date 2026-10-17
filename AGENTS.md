# Repository guidance

## Preserve the portfolio

- The existing React/Vite portfolio is the primary application. Preserve its routes, visual appearance, demos, Pages Functions, D1 schema and media storage.
- Inspect Git status before edits; preserve unrelated work. Use `codex/` feature branches. Do not reset user changes.
- Do not push, deploy, merge, change production configuration, buy services or provision paid infrastructure without explicit user approval.
- Never place secrets in frontend code or `VITE_*` variables. Existing administrative bearer-token handling is not a reusable multi-user authentication system.

## DevPulse AI

- Read `docs/devpulse/PROGRESS.md`, `DECISIONS.md` and `ROADMAP.md` before continuing. They distinguish implemented behavior from proposals.
- Phase 0 is documentation only. Future implementation requires a subsequent user request; stop after the authorized phase.
- Implemented frontend boundary: `src/features/devpulse/`, lazy mounted at `/devpulse/*` inside the existing BrowserRouter. Keep the Vite base at `/`. Phase 1 is local; do not begin Phase 2 without instruction.
- Backend boundary: `services/devpulse/`, Python modular monolith with a dedicated Dramatiq worker. Phase 2 code exists; see PROGRESS for infrastructure verification gates. Do not migrate existing Functions or D1 data into it or start Phase 3 without instruction.
- New DevPulse frontend code uses TypeScript, scoped styles and `devpulse` names for storage/configuration. Do not globally restyle the portfolio.
- Source repositories are untrusted input. Never run their code, package scripts, ESLint configs, plugins or tests in the API process or on the developer host.
- Every finding must distinguish tool observation, AI assessment and verification state. Every citation must resolve to the exact snapshot and line range. Sample data must remain visibly labeled.
- Build complete vertical slices. Hide unavailable controls; do not simulate live analysis, AI responses, costs or passing validations.
- Public exploration uses an explicitly curated safe sample, never direct access to private project data or internal traces.
- At each phase end update progress and decisions, list changed files, report actual checks and limitations, required configuration and next phase.

## Baseline verification

- Existing commands: `npm run build`, `npm run lint`. Phase 1 adds `devpulse:fixture:check`, `typecheck:devpulse`, `lint:devpulse`, `test:devpulse`, `test:devpulse:e2e` and a check-only GitHub Actions workflow. See README for setup.
- Baseline build passes with an oversized entry chunk. Baseline lint fails; see `docs/devpulse/REPOSITORY_AUDIT.md`. Do not mask pre-existing failures or silently broaden scope to repair the whole portfolio.
- Backend: `uv sync --frozen`, `uv run pytest`, `uv run ruff check app tests alembic export_contract.py` from `services/devpulse`. Database integration requires an isolated `devpulse_test*` database and Redis DB 15; never point integration tests at production. No authentication bypass exists; test sessions/signing keys belong only in tests.
- No installs, runtime changes or deployment were authorized in Phase 0. Build output in ignored `dist/` may be regenerated for verification.
