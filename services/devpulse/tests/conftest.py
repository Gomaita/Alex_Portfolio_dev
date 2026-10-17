import os
import uuid
from datetime import timedelta
from urllib.parse import urlsplit

import jwt
import pytest
from alembic.config import Config
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

from alembic import command
from app.core.config import Settings
from app.core.security import csrf_for
from app.db.models import User, now
from app.main import create_app
from app.services.oidc import issue_session


@pytest.fixture
def settings():
    return Settings(
        _env_file=None,
        environment="test",
        database_url="postgresql+psycopg://test:unused@127.0.0.1:5433/devpulse_test",
        redis_url="redis://127.0.0.1:6380/15",
        oidc_issuer="https://identity.example.test",
        oidc_client_id="devpulse-test",
    )


@pytest.fixture(scope="session")
def database_url():
    url = os.getenv("DEVPULSE_TEST_DATABASE_URL")
    if not url:
        pytest.skip("Set DEVPULSE_TEST_DATABASE_URL to isolated PostgreSQL (not SQLite)")
    parsed = make_url(url)
    if not parsed.database or not parsed.database.startswith("devpulse_test"):
        pytest.fail("Safety: integration database name must start with devpulse_test")
    # Unique schema, owned by this test session; never drop public or arbitrary databases.
    schema = "test_" + uuid.uuid4().hex
    engine = create_engine(url)
    with engine.begin() as db:
        db.execute(text("CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public"))
        db.execute(text(f'CREATE SCHEMA "{schema}"'))
    isolated = parsed.update_query_dict({"options": f"-csearch_path={schema},public"})
    isolated_url = isolated.render_as_string(hide_password=False)
    old = os.environ.get("DEVPULSE_DATABASE_URL")
    os.environ["DEVPULSE_DATABASE_URL"] = isolated_url
    os.environ.setdefault("DEVPULSE_REDIS_URL", "redis://127.0.0.1:6380/15")
    from app.core.config import get_settings

    get_settings.cache_clear()
    command.upgrade(Config("alembic.ini"), "head")
    yield isolated_url
    command.downgrade(Config("alembic.ini"), "base")
    with engine.begin() as db:
        db.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
    engine.dispose()
    if old is not None:
        os.environ["DEVPULSE_DATABASE_URL"] = old
    else:
        os.environ.pop("DEVPULSE_DATABASE_URL", None)
    get_settings.cache_clear()


@pytest.fixture
def app(settings, database_url):
    values = settings.model_dump()
    values.update(
        database_url=database_url,
        redis_url=os.getenv("DEVPULSE_TEST_REDIS_URL", "redis://127.0.0.1:6380/15"),
    )
    if urlsplit(values["redis_url"]).path != "/15":
        pytest.fail("Safety: use dedicated Redis test database 15")
    settings = Settings(_env_file=None, **values)
    application = create_app(settings)
    yield application


@pytest.fixture
def client(app):
    with TestClient(app) as client:
        yield client


@pytest.fixture
def signed_in(app, client):
    def login(subject=None):
        with app.state.sessions() as db:
            user = User(
                issuer="https://identity.example.test",
                subject=subject or uuid.uuid4().hex,
                display_name="Test developer",
            )
            db.add(user)
            db.flush()
            token = issue_session(db, user.id, 1)
        client.cookies.set(app.state.settings.cookie_name, token)
        client.headers.update(
            {"Origin": app.state.settings.frontend_origin, "X-CSRF-Token": csrf_for(token)}
        )
        return user.id

    login()
    return login


@pytest.fixture
def signed_identity(settings):
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    jwk = jwt.algorithms.RSAAlgorithm.to_jwk(key.public_key(), as_dict=True)
    jwk.update(kid="local-test-key", use="sig", alg="RS256")
    claims = {
        "sub": "fixture-user",
        "iss": settings.oidc_issuer,
        "aud": settings.oidc_client_id,
        "iat": now(),
        "exp": now() + timedelta(minutes=5),
        "nonce": "expected-nonce",
    }
    return key, {"keys": [jwk]}, claims
