# DevPulse — local development

Phase 2 code is implemented. This machine has Python 3.12.15/uv 0.13.1 installed locally for verification, but no operational Docker CLI/engine, PostgreSQL or Redis. The `docker-desktop` WSL distribution contains a CLI placeholder that refuses execution. Container/database/real worker acceptance is therefore pending, not reported as passing. No production services were contacted.

## Prerequisites

Node 24 + npm (existing portfolio), Python 3.12, uv, Docker Engine/Desktop with Compose v2. Use the root npm commands as before. Backend commands below run from `services/devpulse` unless indicated otherwise.

```sh
uv sync --frozen
cp .env.example .env
uv run python -c "import secrets; print(secrets.token_hex(24))"
```

Set the generated **local** password as `POSTGRES_PASSWORD` and in `DEVPULSE_DATABASE_URL` in the ignored `.env`. Never copy it to frontend configuration. Examples use loopback `127.0.0.1` consistently; mixing it with `localhost` breaks cookie/site behavior. No default production password or development auth bypass is provided.

## Compose

```sh
docker compose config --quiet
docker compose up --build -d
docker compose ps
docker compose logs --tail=100 api worker migrate
```

Postgres/pgvector is loopback port **5433**, Redis **6380**, API **8000**. `migrate` runs Alembic before API/worker start. API readiness checks schema, vector extension, Redis and the worker heartbeat. Health: `http://127.0.0.1:8000/api/v1/health`; readiness: `/api/v1/ready`; local OpenAPI UI: `/docs`.

API and worker share an image/codebase, run non-root with a read-only root filesystem, bounded resources and a writable `/tmp`. Database and Redis use named development volumes. Compose is explicitly a **development** topology; it does not select or configure production hosting.

To run Python processes on the host instead:

```sh
docker compose up -d postgres redis
uv run alembic upgrade head
uv run uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8000 --no-access-log --no-proxy-headers
# Separate terminal, same directory/environment:
uv run python -m app.workers.runtime
```

No tables are created on API startup. `uv run alembic current` checks the revision. `uv run alembic upgrade head --sql` inspects SQL offline. Downgrades remove Phase 2 tables; never run them against valued data without a backup and explicit approval.

Stop without deleting data: `docker compose down`. A **deliberate destructive local reset** is `docker compose down --volumes` followed by `docker compose up --build -d`; it deletes this Compose project's database and Redis volumes. This reset has not been executed by the implementation agent.

## Identity provider

Register a standards-compliant OIDC authorization-code client with **PKCE S256** and **RS256** ID tokens. No provider account was provisioned. A hosted provider or locally managed Keycloak can supply this identity; it must be reachable from the API runtime.

- Local callback: `http://127.0.0.1:8000/api/v1/auth/callback`.
- Production callback: the explicitly approved HTTPS API origin + `/api/v1/auth/callback`.
- Scopes: `openid profile email`. No GitHub repository scopes.
- Configure `DEVPULSE_OIDC_ISSUER` (exact discovery issuer), `DEVPULSE_OIDC_CLIENT_ID`, and optionally `DEVPULSE_OIDC_CLIENT_SECRET` for `client_secret_basic` clients. Public clients use PKCE without a client secret.
- Server discovery, token and JWKS requests require TLS. HTTP is allowed only for loopback outside production. For container development with a local IdP, arrange an HTTPS hostname reachable both in the browser and containers; the issuer cannot be changed between them.
- The adapter supports authorization-code query callbacks, RS256 and client-secret-basic/public PKCE. Other algorithms, response modes and client-auth methods are intentionally unsupported, not silently accepted.
- Logout revokes the DevPulse session. It does **not** sign out of the upstream identity provider. Sessions expire after 8 hours by default; no silent refresh tokens are stored.

Without provider configuration the public sample and API health still work; private sign-in returns a clear configuration error. No arbitrary username/test-user endpoint exists. Automated tests use ephemeral RSA keys and server-issued sessions in isolated test schemas, not a runtime bypass.

## Frontend

In the **root** ignored `.env.local`:

```dotenv
VITE_DEVPULSE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Then from root:

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open `/devpulse/projects`. The configured `DEVPULSE_FRONTEND_ORIGIN` must exactly match `http://127.0.0.1:5173`. Leaving `VITE_DEVPULSE_API_BASE_URL` empty exposes an honest unavailable private workspace; the three public Phase 1 routes continue without network/backend access. Restart Vite after changing public configuration.

## Tests

```sh
# Backend, no infrastructure required (integration cases explicitly skip):
uv run pytest -q -rs
uv run ruff check app tests alembic export_contract.py
uv run ruff format --check app tests alembic export_contract.py
uv run python export_contract.py
```

For real integration, create an **isolated test database**, not the development or production database:

```sh
docker compose exec postgres createdb -U devpulse devpulse_test
```

Set `DEVPULSE_TEST_DATABASE_URL=postgresql+psycopg://devpulse:<local-password>@127.0.0.1:5433/devpulse_test` and `DEVPULSE_TEST_REDIS_URL=redis://127.0.0.1:6380/15`, then `uv run pytest -q`. PowerShell uses `$env:NAME='value'`; POSIX shells use `export NAME='value'`.

Tests reject database names not beginning `devpulse_test`. Each session creates a random `test_<uuid>` schema, migrates it, checks drift, then downgrades and drops only that schema. pgvector remains in public. Redis DB 15 must be dedicated to tests, separate from application DB 0. Never run tests concurrently against an active worker using the same Redis DB. The worker integration starts a real subprocess and checks queued → completed persistence, timestamps, attempts, readiness and duplicate delivery. The OIDC integration mocks provider HTTP responses using real locally signed JWTs; it is not hosted-provider verification.

Frontend from root:

```sh
npm run devpulse:fixture:check
npm run typecheck:devpulse
npm run lint:devpulse
npm run test:devpulse
npx playwright install chromium
npm run test:devpulse:e2e
npm run build
```

Playwright starts a fresh Vite server on 4173 with a test-only API origin. Do not leave a differently configured Vite server running on that port. Private UI tests intercept HTTP with controlled responses; they validate UX/contracts, not real database persistence. Browser snapshots are ignored under `test-results/devpulse`. For actual full-stack manual verification: sign in as two provider users, create/edit/refresh/delete a project, verify isolation, run/cancel a diagnostic, restart the worker and confirm durable state. This final provider-backed browser journey remains unexecuted on this machine.

## Configuration reference

| Variable | Location / purpose |
| --- | --- |
| `POSTGRES_PASSWORD` | Compose-only development database password, required |
| `DEVPULSE_DATABASE_URL` | Server secret, `postgresql+psycopg://…`; host port 5433, container service port 5432 |
| `DEVPULSE_REDIS_URL` | Server secret, application Redis DB 0 |
| `DEVPULSE_ENVIRONMENT` | `development`, `test`, `production`; production requires HTTPS + OIDC |
| `DEVPULSE_FRONTEND_ORIGIN` | One exact allowed frontend origin, no trailing slash/path/wildcard |
| `DEVPULSE_API_ORIGIN` | Public API origin used to construct callback |
| `DEVPULSE_OIDC_ISSUER`, `DEVPULSE_OIDC_CLIENT_ID` | Required together to enable login |
| `DEVPULSE_OIDC_CLIENT_SECRET` | Optional server-only confidential client credential |
| `DEVPULSE_SESSION_HOURS` | 1–24 hours, default 8 |
| `DEVPULSE_DIAGNOSTIC_LIMIT` | 1–60 per authenticated user/minute, default 5 |
| `DEVPULSE_MUTATION_LIMIT` | 1–600 per authenticated user/minute, default 60 |
| `VITE_DEVPULSE_API_BASE_URL` | Public frontend URL including `/api/v1`; no credentials |
| `DEVPULSE_TEST_DATABASE_URL`, `DEVPULSE_TEST_REDIS_URL` | Test-only isolated infrastructure; never frontend variables |

Production transport validation: settings require PostgreSQL `sslmode=verify-full` and a `rediss://` Redis URL, in addition to HTTPS origins/OIDC. Configure the database CA/root certificate and Redis authentication/certificate trust at the host; development Compose remains loopback/private local networking.
