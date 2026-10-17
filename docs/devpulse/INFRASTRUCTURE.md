# DevPulse AI — future configuration inventory

Status: no services provisioned, accounts connected, secrets requested or production settings changed. Phase 1 needs no paid service or API key. Values below are names/proposals, not secrets or established settings.

## User actions by gate

| When | Needed from owner | Why |
| --- | --- | --- |
| Before any deployment change | Confirm Cloudflare project type, production branch, root/build/output settings, domain and bindings from dashboard | Resolve Pages/Workers discrepancy; local config is insufficient |
| Phase 2 live identity | Choose existing OIDC provider or authorize one; set callback URLs and client credentials in backend secret manager | Real per-user/project authorization; local test identity cannot ship |
| Before hosted backend | Approve host, region, budget, API subdomain DNS and service configuration | Containers for API + worker, Postgres/pgvector, Redis, private object storage; no provider selected blindly |
| Phase 4 | Approve model/provider, source processing policy, region/retention and explicit spend cap; configure server credentials | Enable real AI without leaking source or unlimited spend |
| Phase 6 executable tests | Approve isolated runner/provider and resource budget after security validation | Hostile repository tests cannot run on API/server/developer machine |
| Phase 7 optional | Approve Langfuse hosting/region and telemetry policy; configure project keys | Metadata-only traces until privacy checks pass |
| Phase 8 | Create/configure minimally privileged GitHub App and selected installations, webhook domain/secret, private key | Read-only repository authorization and verified events |
| Phase 9 | Approve concrete tested release and production changes | Push/deploy/merge and production settings remain approval-gated |

No decision blocks completion of Phase 0. Phase 1 can proceed locally after the next user instruction; deployment confirmation can wait until a preview/release is actually proposed.

## Proposed environment contracts

| Location | Names | Handling |
| --- | --- | --- |
| Frontend | `VITE_DEVPULSE_API_BASE_URL` | Public URL only; sample mode requires none |
| API/worker | `DEVPULSE_ENV`, `DATABASE_URL`, `REDIS_URL`, `ALLOWED_ORIGINS`, `PUBLIC_API_URL`, `FRONTEND_URL` | Validated settings; database/Redis credentials secret; exact origin allowlist |
| Identity | `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_REDIRECT_URI`, `SESSION_SECRET` | Backend only, secure session configuration and rotation |
| Private storage | `S3_ENDPOINT_URL`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Separate private DevPulse storage; prefer workload identity if host supports it |
| AI | `LLM_PROVIDER`, `LLM_MODEL`, `LLM_API_KEY`, `EMBEDDING_MODEL`, `DEVPULSE_DAILY_COST_LIMIT_USD` | Server-only; no implicit paid fallback; estimate rate table versioned |
| Policy | `MAX_ARCHIVE_BYTES`, `MAX_EXPANDED_BYTES`, `MAX_FILES`, `MAX_JOB_SECONDS`, `MAX_CONCURRENT_RUNS` | Validate at startup, persist policy version per run |
| Observability | `LANGFUSE_ENABLED`, `LANGFUSE_BASE_URL`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` | All configured server-side; disabled until privacy tests pass |
| GitHub App | `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET` | Secret manager; selected repository access, token rotation |
| Runner | `SANDBOX_PROVIDER`, provider-specific endpoint/credential | Disabled until isolation gate passes; no host Docker socket in API |

Exact names finalized with implementation schema and safe `.env.example` files in the relevant phase. Do not change existing portfolio `VITE_API_BASE_URL`, `VITE_BACKEND_ENABLED`, `ADMIN_API_TOKEN`, D1 `DB`, R2 `MEDIA_BUCKET`, AI or Resend configuration. Existing `.env.example` contains a public `VITE_OPENWEATHER_API_KEY` placeholder; do not copy that pattern for private DevPulse credentials.

## Hosting acceptance checklist

One container host with separately scaled API and worker; managed Postgres supporting pgvector; private Redis; private S3-compatible object storage. Confirm region/data residency, TLS/private networking, backups and restore, extension availability, connection limits, persistent worker lifecycle, execution deadlines, SSE/proxy behavior, log redaction and secret rotation. Prefer the same region for API, DB and worker. Use resource/budget caps and measured capacity tests, not guessed free-tier capacity. External sandbox can be deferred if test execution is explicitly unavailable.

Local development target: existing Vite app plus service-scoped Docker Compose for API, worker, Postgres and Redis, with a local private storage adapter and fake provider restricted to tests. Python tooling/lockfile and Node runtime pins chosen in Phase 2/1 respectively. CI must not execute imported repository scripts or expose live credentials on pull requests.

Deployment verification must test API JSON responses independently of frontend SPA fallback, exact credentialed CORS and preflight, session/CSRF, SSE disconnect/reconnect, private cache headers, nested refresh and metadata. CSP should be designed for DevPulse including Monaco workers and API connections without breaking existing portfolio demos; avoid a blanket header change until regression-tested. Staging has separate data/secrets and cannot read production private repositories.
