# DevPulse backend

Phase 2 modular monolith: FastAPI, PostgreSQL/pgvector, SQLAlchemy/Alembic and a Redis-backed Dramatiq worker. No repository downloads, scanners, model calls or execution of imported code.

See [local setup](../../docs/devpulse/LOCAL_DEVELOPMENT.md), [API](../../docs/devpulse/API.md), [database](../../docs/devpulse/DATABASE.md), [deployment prerequisites](../../docs/devpulse/DEPLOYMENT_PLAN.md) and [actual verification](../../docs/devpulse/PROGRESS.md).

From this directory, after configuring `.env`:

```sh
uv sync --frozen
docker compose up --build -d
uv run pytest -q
uv run ruff check app tests alembic export_contract.py
uv run python export_contract.py
```

`pytest` skips integration tests unless `DEVPULSE_TEST_DATABASE_URL` is explicitly configured. Skips are not passing persistence or worker tests. `uv.lock` pins Python dependencies; no Python dependencies are added to the portfolio npm application.
