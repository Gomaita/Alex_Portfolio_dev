# DevPulse — deployment plan (not executed)

No infrastructure, DNS, deployment, push or merge has been performed for Phase 2. Release requires the remaining integration gates in PROGRESS and explicit owner approval.

## Cloudflare boundary

The repository has Pages Functions under `functions/api`, D1 portfolio records, public R2 media and `public/_redirects` SPA fallback. `wrangler.jsonc` instead describes Workers static assets with `not_found_handling: single-page-application`. Actual account mode remains unconfirmed. The Pages [file-routing contract](https://developers.cloudflare.com/pages/functions/routing/) means an overlapping `/api/*` handler could intercept existing portfolio endpoints. No proxy, route handler, D1 migration or R2 binding is added in Phase 2.

Keep the existing frontend deployment and `/devpulse/*` routes. Private-workspace metadata is generic and noindex/nofollow; no private names/data enter HTML. Check actual preview deep-link refresh before release, not only Vite.

## Proposed topology

- Existing frontend: `https://alexgl.dev`.
- Separate API: proposed `https://api.devpulse.alexgl.dev` on an approved container host.
- Worker: same versioned image, separate long-running process; private PostgreSQL and Redis connectivity.
- Dedicated PostgreSQL/pgvector: encrypted storage, TLS/private network, backups and least-privilege application credentials.
- Dedicated Redis: private authenticated/TLS instance with noeviction policy. PostgreSQL remains the durable job ledger.
- Owner-selected OIDC provider: exact callback, authorization code/PKCE S256, RS256 ID tokens. No GitHub repository permissions.

Provider/region/hosting selection remains open; no price or free-tier assumptions. Hosting must support workers, graceful shutdown, migrations, private networking, quotas and backups. Do not scale workers to zero while accepting jobs.

Set `DEVPULSE_FRONTEND_ORIGIN=https://alexgl.dev` and public `VITE_DEVPULSE_API_BASE_URL=https://api.devpulse.alexgl.dev/api/v1`. Direct API requests avoid changing existing `/api` handlers. CORS is exact-origin and credentialed; mutations additionally require Origin and CSRF. SameSite=Lax works across those same-site HTTPS subdomains. A `*.pages.dev` preview is cross-site: use an isolated same-site custom preview domain/backend/provider client or keep it sample-only. Do not weaken cookie/CORS restrictions to share production sessions with arbitrary previews.

## Release sequence after approval

1. Confirm Pages versus Workers account configuration and existing fallback/Functions behavior.
2. Execute Compose build/start, PostgreSQL migrations/drift/pgvector, real Redis worker, restart/recovery, ownership and full-stack OIDC/browser tests on isolated infrastructure. Resolve skipped tests first.
3. Build a versioned image, review vulnerabilities and pin production image digests. Local Compose tags are not immutable. Preserve `uv.lock`.
4. Configure API/worker secrets outside Vite, `DEVPULSE_ENVIRONMENT=production`, HTTPS origins and provider client. Restrict DB/Redis access; define trusted reverse-proxy peers explicitly (Uvicorn defaults here trust none).
5. Pre-enable pgvector using a migration role if necessary, run `alembic upgrade head` once as a release task. Application credentials must not administer the schema. No startup downgrade/create_all.
6. Start worker/API and check readiness before connecting an approved frontend preview. Never cache API/auth responses. Disable callback query-string access logs and redact Cookie/Authorization at the hosting layer.
7. Verify actual login/expiry/logout, CSRF, two-user isolation, create/edit/refresh/delete, diagnostics/cancellation/recovery, all portfolio route families and existing APIs.
8. Configure alerts for worker heartbeat, queue age, retries, database saturation and sanitized failure codes. Establish physical deletion, retention and backup restore procedures. No purge scheduler is delivered in Phase 2.
9. Obtain explicit production-deployment approval. Keep prior frontend/image artifacts; schema rollback needs a separate reviewed data plan.

No source is ingested in Phase 2. Container limits are not an untrusted-code sandbox. Phase 3 requires isolated ingestion/tools, egress restrictions and archive defenses. Hosted-provider compatibility, real production cookies/CORS, backup restore, physical purge and live deployment routing remain unverified release gates.

Production transport validation: settings require PostgreSQL `sslmode=verify-full` and a `rediss://` Redis URL, in addition to HTTPS origins/OIDC. Configure the database CA/root certificate and Redis authentication/certificate trust at the host; development Compose remains loopback/private local networking.
