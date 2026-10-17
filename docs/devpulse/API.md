# DevPulse API — Phase 2

Source of truth: `services/devpulse/openapi.json`, exported from the real FastAPI application. Development `/docs` and `/openapi.json` are disabled in production. Regenerate with `uv run python export_contract.py` from the service directory; this also regenerates `src/features/devpulse/api/contracts.ts`. The exporter needs no live database or credentials. CI checks drift. Unsupported JSON Schema constructs fail export rather than generate unsafe types.

All paths below have prefix `/api/v1`. Responses are private/non-cacheable. Request IDs are server-generated UUIDs, returned in `X-Request-ID` and errors. Arbitrary client request IDs are not trusted or logged.

| Method / path | Access and result |
| --- | --- |
| GET `/health` | Public, 200 liveness; no dependency secrets |
| GET `/ready` | Public, 200 if migration/pgvector/Redis/worker healthy; generic 503 otherwise |
| GET `/auth/login` | Rate-limited OIDC redirect, 303; unavailable if provider absent |
| GET `/auth/callback?state=…&code=…` | One-use state/browser binding, PKCE exchange and ID-token verification; cookie + fixed frontend redirect |
| GET `/me` | Authenticated identity, expiry and session-bound CSRF token; 401 otherwise |
| POST `/auth/logout` | Auth + CSRF/Origin; revoke session, delete cookie, 204 |
| GET `/projects?limit=20&offset=0&search=` | Owner-only list, newest creation first, UUID tie-breaker |
| POST `/projects` | Auth + CSRF; 201 project + Location, membership and audit event |
| GET `/projects/{project_id}` | Owner-only 200; missing/deleted/not-owned all 404 |
| PATCH `/projects/{project_id}` | Auth + CSRF; editable name/description/default_branch, 200 + audit |
| DELETE `/projects/{project_id}` | Auth + CSRF; soft deletion and active-job cancellation, 204; subsequent access 404 |
| POST `/projects/{project_id}/jobs` | Auth + CSRF + Idempotency-Key, allowlisted diagnostic only, 202 + Location |
| GET `/projects/{project_id}/jobs?limit=20&offset=0` | Owner-only persisted history |
| GET `/projects/{project_id}/jobs/{job_id}` | Owner-only persisted state, no internal lease token |
| POST `/projects/{project_id}/jobs/{job_id}/cancel` | Auth + CSRF; queued/running become cancelled, 200; terminal-state repeats return unchanged state |

Lists return `{items,total,limit,offset}`. Limits 1–100, offset 0–10000. Literal case-insensitive project-name search is at most 100 characters; `%`/`_` are escaped, not user-supplied SQL wildcards. Offset pagination is deliberately adequate for the bounded Phase 2 library; concurrent new inserts may shift page boundaries. Cursor pagination is deferred until larger histories require it.

Create body:

```json
{"name":"Dispatch","description":"Task service","source_type":"github","repository_url":"https://github.com/owner/repository","default_branch":"main"}
```

`name` 1–100 trimmed characters; description 0–2000; branch optional ≤100. Source `manual` omits repository URL; `github` requires a strict HTTPS github.com owner/repo URL without credentials, ports, query, fragment or additional path. URL validation stores a reference only: **no fetch occurs**. Visibility is always private. Source type/repository reference are immutable in Phase 2; PATCH changes descriptive fields only. Unknown fields, including frontend-supplied owner/user IDs, are rejected. DELETE retains a tombstone and audit metadata; it is not a physical purge promise.

Job body: `{"job_type":"diagnostic"}`. `Idempotency-Key` is required, 16–64 ASCII letters/digits/underscore/hyphen; the frontend generates UUIDs and retains the key across uncertain retries. Same project/key returns the original job, including terminal jobs. There are no variable diagnostic payloads, arbitrary task names, commands or source inputs. Maximum two active diagnostics per project and five submissions/user/minute by default. Mutations share a separate 60/user/minute limiter. Redis failure fails rate-limited writes closed with 503; existing durable queued records survive.

Job response exposes `id, project_id, job_type, status, progress, stage, error_category, attempt_count, cancel_requested, created_at, started_at, completed_at`. Stage/progress reflect actual infrastructure operations, not repository analysis. No diagnostic creates an AnalysisRun.

Session cookie: opaque random value, HttpOnly, SameSite=Lax, host-only; HTTPS adds Secure and `__Host-devpulse` prefix. API calls use `credentials: include`. Obtain `csrf_token` from `/me`, keep it in memory and pass `X-CSRF-Token` on POST/PATCH/DELETE together with the browser's exact allowed Origin. This is independent of portfolio shared admin authentication.

Errors:

```json
{"error":{"code":"not_found","message":"Project not found.","request_id":"server-uuid","retryable":false}}
```

401 missing/expired identity; 403 invalid CSRF/origin/disabled account; 404 hidden or missing resource; 409 active-job limit/state conflict; 413 body >16 KiB; 422 invalid input (field locations only, never submitted values); 429 quota with Retry-After; 503 unavailable dependencies. Unexpected exceptions return sanitized 500 responses. GET gets at most one frontend retry with a short delay within a 10-second overall request budget; writes are not automatically retried. Polling is 5 seconds (15 when hidden), at most 60 iterations per load, stops on terminal jobs/errors/unmount and has manual refresh.
