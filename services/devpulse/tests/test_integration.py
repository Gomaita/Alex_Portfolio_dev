import os
import subprocess
import sys
import time
import uuid
from datetime import timedelta
from urllib.parse import parse_qs, urlsplit

import httpx
import jwt
import pytest
from alembic.config import Config
from sqlalchemy import select, text

from alembic import command
from app.db.models import AuditEvent, Job, Session, now
from app.services.oidc import challenge
from app.workers.runtime import Runtime

pytestmark = pytest.mark.integration


def create(client, name="A real project"):
    response = client.post("/api/v1/projects", json={"name": name})
    assert response.status_code == 201, response.text
    return response.json()["id"]


def test_migration_pgvector_and_no_schema_drift(app):
    with app.state.sessions() as db:
        assert db.scalar(text("SELECT extversion FROM pg_extension WHERE extname='vector'"))
        assert db.scalar(text("SELECT version_num FROM alembic_version")) == "0001"
        assert db.scalar(text("SELECT current_schema()")).startswith("test_")
    command.check(Config("alembic.ini"))


def test_crud_pagination_and_soft_delete(client, signed_in, app):
    project_id = create(client)
    create(client, "Second")
    listing = client.get("/api/v1/projects?limit=1").json()
    assert listing["total"] == 2 and len(listing["items"]) == 1
    assert client.get("/api/v1/projects?limit=1&offset=1").json()["items"][0]["id"] == project_id
    assert client.get("/api/v1/projects?search=Second").json()["total"] == 1
    assert client.get("/api/v1/projects?search=%25").json()["total"] == 0
    updated = client.patch(
        f"/api/v1/projects/{project_id}", json={"name": "Updated", "description": "Saved"}
    )
    assert updated.status_code == 200
    assert client.get(f"/api/v1/projects/{project_id}").json()["name"] == "Updated"
    assert client.delete(f"/api/v1/projects/{project_id}").status_code == 204
    assert client.get(f"/api/v1/projects/{project_id}").status_code == 404
    assert client.get("/api/v1/projects").json()["total"] == 1
    with app.state.sessions() as db:
        events = db.scalars(
            select(AuditEvent.action).where(AuditEvent.project_id == uuid.UUID(project_id))
        ).all()
        assert set(events) == {"project.created", "project.updated", "project.deleted"}


def test_ownership_isolation_and_validation(client, signed_in):
    project_id = create(client)
    signed_in()
    for method, path, body in [
        ("GET", f"/projects/{project_id}", None),
        ("PATCH", f"/projects/{project_id}", {"name": "Stolen"}),
        ("DELETE", f"/projects/{project_id}", None),
        ("GET", f"/projects/{project_id}/jobs", None),
        ("POST", f"/projects/{project_id}/jobs", {"job_type": "diagnostic"}),
        ("POST", f"/projects/{project_id}/jobs/{uuid.uuid4()}/cancel", None),
    ]:
        response = client.request(
            method, "/api/v1" + path, json=body, headers={"Idempotency-Key": uuid.uuid4().hex}
        )
        assert response.status_code == 404
    assert client.get("/api/v1/projects").json()["items"] == []
    assert (
        client.post("/api/v1/projects", json={"name": "", "owner_id": project_id}).status_code
        == 422
    )
    assert client.get("/api/v1/projects?limit=101").status_code == 422
    assert client.get("/api/v1/projects?offset=10001").status_code == 422


def test_csrf_logout_and_expiry(client, signed_in, app):
    assert client.get("/api/v1/me").status_code == 200
    assert (
        client.post(
            "/api/v1/projects", json={"name": "A"}, headers={"Origin": "https://attacker.test"}
        ).status_code
        == 403
    )
    assert (
        client.post(
            "/api/v1/projects", json={"name": "A"}, headers={"X-CSRF-Token": "wrong"}
        ).status_code
        == 403
    )
    assert client.post("/api/v1/auth/logout").status_code == 204
    assert client.get("/api/v1/me").status_code == 401
    user_id = signed_in()
    with app.state.sessions.begin() as db:
        session = db.scalar(select(Session).where(Session.user_id == user_id))
        session.expires_at = now() - timedelta(seconds=1)
    assert client.get("/api/v1/me").status_code == 401


def test_diagnostic_idempotency_cancellation_and_limits(client, signed_in, app):
    project_id = create(client)
    path = f"/api/v1/projects/{project_id}/jobs"
    headers = {"Idempotency-Key": uuid.uuid4().hex}
    first = client.post(path, json={}, headers=headers)
    assert first.status_code == 202
    assert client.post(path, json={}, headers=headers).json()["id"] == first.json()["id"]
    assert client.post(path, json={"job_type": "shell"}, headers=headers).status_code == 422
    second = client.post(path, json={}, headers={"Idempotency-Key": uuid.uuid4().hex})
    assert second.status_code == 202
    assert (
        client.post(path, json={}, headers={"Idempotency-Key": uuid.uuid4().hex}).status_code == 409
    )
    cancelled = client.post(path + "/" + first.json()["id"] + "/cancel")
    assert cancelled.json()["status"] == "cancelled"
    assert client.delete(f"/api/v1/projects/{project_id}").status_code == 204
    with app.state.sessions() as db:
        assert db.get(Job, uuid.UUID(second.json()["id"])).status == "cancelled"


def test_real_worker_process_round_trip(client, signed_in, app, database_url):
    project_id = create(client)
    path = f"/api/v1/projects/{project_id}/jobs"
    queued = client.post(path, json={}, headers={"Idempotency-Key": uuid.uuid4().hex}).json()
    assert queued["status"] == "queued"
    env = dict(
        os.environ,
        DEVPULSE_DATABASE_URL=database_url,
        DEVPULSE_REDIS_URL=app.state.settings.redis_url.get_secret_value(),
    )
    worker = subprocess.Popen([sys.executable, "-m", "app.workers.runtime"], env=env)
    try:
        deadline = time.monotonic() + 30
        result = queued
        while time.monotonic() < deadline:
            result = client.get(path + "/" + queued["id"]).json()
            if result["status"] in {"completed", "failed"}:
                break
            time.sleep(0.2)
        assert result["status"] == "completed", result
        assert result["attempt_count"] == 1 and result["progress"] == 100
        assert result["started_at"] and result["completed_at"]
        assert client.get("/api/v1/ready").status_code == 200
        # Duplicate delivery after completion must not produce a second execution.
        runtime = Runtime(app.state.settings)
        try:
            runtime.execute(queued["id"])
        finally:
            runtime.close()
        assert client.get(path + "/" + queued["id"]).json()["attempt_count"] == 1
    finally:
        worker.terminate()
        worker.wait(timeout=20)


def test_expired_lease_recovery(client, signed_in, app):
    project_id = create(client)
    job_id = client.post(
        f"/api/v1/projects/{project_id}/jobs",
        json={},
        headers={"Idempotency-Key": uuid.uuid4().hex},
    ).json()["id"]
    with app.state.sessions.begin() as db:
        job = db.get(Job, uuid.UUID(job_id))
        job.status, job.attempt_count = "running", 3
        job.lease_until = now() - timedelta(seconds=1)
    runtime = Runtime(app.state.settings)
    try:
        runtime.dispatch()
    finally:
        runtime.close()
    assert client.get(f"/api/v1/projects/{project_id}/jobs/{job_id}").json()["status"] == "failed"


def test_real_oidc_exchange_and_replay(client, app, respx_mock, signed_identity):
    settings = app.state.settings
    key, jwks, claims = signed_identity
    base = settings.oidc_issuer
    respx_mock.get(base + "/.well-known/openid-configuration").respond(
        200,
        json={
            "issuer": base,
            "authorization_endpoint": base + "/authorize",
            "token_endpoint": base + "/token",
            "jwks_uri": base + "/keys",
        },
    )
    respx_mock.get(base + "/keys").respond(200, json=jwks)
    response = client.get("/api/v1/auth/login", follow_redirects=False)
    assert response.status_code == 303
    params = parse_qs(urlsplit(response.headers["location"]).query)
    claims["nonce"] = params["nonce"][0]
    encoded = jwt.encode(claims, key, algorithm="RS256", headers={"kid": "local-test-key"})

    def exchange(request):
        submitted = parse_qs(request.content.decode())
        assert challenge(submitted["code_verifier"][0]) == params["code_challenge"][0]
        assert submitted["code"] == ["valid-code"]
        return httpx.Response(200, json={"id_token": encoded, "access_token": "discard-me"})

    respx_mock.post(base + "/token").mock(side_effect=exchange)
    callback = "/api/v1/auth/callback?state=" + params["state"][0] + "&code=valid-code"
    assert client.get(callback, follow_redirects=False).headers["location"].endswith("/projects")
    assert client.get("/api/v1/me").status_code == 200
    assert "discard-me" not in str(client.cookies)
    assert (
        "HttpOnly" in client.get("/api/v1/auth/login", follow_redirects=False).headers["set-cookie"]
    )
    assert client.get(callback, follow_redirects=False).headers["location"].endswith("auth=failed")
