from types import SimpleNamespace

import jwt
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.core.errors import APIError
from app.db.models import now
from app.main import create_app
from app.schemas.contracts import ProjectInput, ProjectPatch
from app.services.jobs import TRANSITIONS, cancel, transition
from app.services.oidc import OIDC, challenge


def test_health_and_safe_errors_without_database(settings):
    with TestClient(create_app(settings), raise_server_exceptions=False) as client:
        health = client.get("/api/v1/health")
        assert health.status_code == 200
        assert health.headers["cache-control"] == "no-store"
        assert health.headers["x-request-id"]
        assert client.get("/api/v1/me").status_code == 401
        assert client.get("/api/v1/projects").status_code == 401
        assert client.get("/not-found").json()["error"]["code"] == "http_error"
        assert client.post("/api/v1/projects", content="x" * 16385).status_code == 413
        assert client.get("/api/v1/ready").status_code == 503


def test_cors_is_explicit(settings):
    with TestClient(create_app(settings)) as client:
        headers = {"Origin": settings.frontend_origin, "Access-Control-Request-Method": "POST"}
        assert client.options("/api/v1/projects", headers=headers).status_code == 200
        headers["Origin"] = "https://attacker.test"
        response = client.options("/api/v1/projects", headers=headers)
        assert response.status_code == 400
        assert "access-control-allow-origin" not in response.headers


def test_unknown_errors_are_redacted(settings, caplog):
    app = create_app(settings)

    @app.get("/test-error")
    def fail():
        raise RuntimeError("private-provider-secret")

    with TestClient(app) as client:
        response = client.get("/test-error")
        assert response.status_code == 500
        assert response.json()["error"]["code"] == "internal_error"
        assert "private-provider-secret" not in response.text + caplog.text


@pytest.mark.parametrize(
    "url",
    [
        "http://github.com/a/b",
        "https://github.com@localhost/a/b",
        "https://github.com/a/b?token=secret",
        "https://127.0.0.1/a/b",
        "https://github.com/a/..",
        "https://github.com/a/b/tree/main",
        "file:///etc/passwd",
    ],
)
def test_repository_urls_are_data_only_and_restricted(url):
    with pytest.raises(ValidationError):
        ProjectInput(name="A", source_type="github", repository_url=url)


def test_schema_and_production_configuration(settings):
    assert ProjectInput(name=" A ").name == "A"
    for payload in ({"name": None}, {}, {"owner_id": "attacker"}):
        with pytest.raises(ValidationError):
            ProjectPatch(**payload)
    values = settings.model_dump()
    values["environment"] = "production"
    with pytest.raises(ValidationError):
        Settings(_env_file=None, **values)
    values.update(
        frontend_origin="https://alexgl.dev", api_origin="https://api.devpulse.alexgl.dev"
    )
    with pytest.raises(ValidationError):
        Settings(_env_file=None, **values)
    values.update(
        database_url="postgresql+psycopg://test@db.test/devpulse?sslmode=verify-full",
        redis_url="rediss://cache.test:6379/0",
    )
    assert Settings(_env_file=None, **values).secure_cookie
    values["oidc_issuer"] = None
    with pytest.raises(ValidationError):
        Settings(_env_file=None, **values)


@pytest.mark.parametrize("state", ["completed", "failed", "cancelled"])
def test_terminal_jobs_cannot_restart(state):
    job = SimpleNamespace(status=state)
    with pytest.raises(APIError):
        transition(job, "running")
    assert not TRANSITIONS[state]


def test_cancellation_fences_inflight_completion():
    job = SimpleNamespace(status="running", lease_token="token", lease_until=now())
    cancel(job)
    assert job.cancel_requested and job.status == "cancelled" and job.lease_token is None
    with pytest.raises(APIError):
        transition(job, "completed")


def test_pkce_rfc7636_vector():
    assert challenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk") == (
        "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
    )


def test_real_signed_oidc_identity(settings, signed_identity):
    key, jwks, claims = signed_identity
    encoded = jwt.encode(claims, key, algorithm="RS256", headers={"kid": "local-test-key"})
    assert OIDC(settings).verify(encoded, jwks, "expected-nonce")["sub"] == "fixture-user"
    with pytest.raises(ValueError):
        OIDC(settings).verify(encoded, jwks, "wrong-nonce")


@pytest.mark.parametrize(
    "field,value",
    [("iss", "https://attacker.test"), ("aud", "wrong"), ("exp", 1), ("azp", "wrong")],
)
def test_invalid_signed_claims_rejected(settings, signed_identity, field, value):
    key, jwks, claims = signed_identity
    claims[field] = value
    encoded = jwt.encode(claims, key, algorithm="RS256", headers={"kid": "local-test-key"})
    with pytest.raises((jwt.PyJWTError, ValueError)):
        OIDC(settings).verify(encoded, jwks, "expected-nonce")


def test_unsigned_and_wrong_key_rejected(settings, signed_identity):
    key, jwks, claims = signed_identity
    encoded = jwt.encode(claims, key, algorithm="RS256", headers={"kid": "unknown"})
    with pytest.raises(ValueError):
        OIDC(settings).verify(encoded, jwks, "expected-nonce")
    encoded = jwt.encode(
        claims,
        "not-a-real-secret-just-a-test-key-32",
        algorithm="HS256",
        headers={"kid": "local-test-key"},
    )
    with pytest.raises(ValueError):
        OIDC(settings).verify(encoded, jwks, "expected-nonce")
