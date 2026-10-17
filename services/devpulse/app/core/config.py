from functools import lru_cache
from typing import Literal
from urllib.parse import parse_qs, urlsplit

from pydantic import SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="DEVPULSE_", env_file=".env", extra="ignore")
    environment: Literal["development", "test", "production"] = "development"
    database_url: SecretStr
    redis_url: SecretStr
    frontend_origin: str = "http://127.0.0.1:5173"
    api_origin: str = "http://127.0.0.1:8000"
    oidc_issuer: str | None = None
    oidc_client_id: str | None = None
    oidc_client_secret: SecretStr | None = None
    session_hours: int = 8
    diagnostic_limit: int = 5
    mutation_limit: int = 60

    @field_validator("oidc_issuer", "oidc_client_id", "oidc_client_secret", mode="before")
    @classmethod
    def empty_optional(cls, value):
        return None if value == "" else value

    @model_validator(mode="after")
    def secure_configuration(self):
        for value in (self.frontend_origin, self.api_origin):
            parsed = urlsplit(value)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                raise ValueError("Origins must be absolute HTTP(S) origins")
            if parsed.path or parsed.query or parsed.fragment or parsed.username:
                raise ValueError("Origins must not include paths or credentials")
        for value in (self.frontend_origin, self.api_origin, self.oidc_issuer):
            if not value:
                continue
            parsed = urlsplit(value)
            if parsed.scheme not in {"http", "https"} or not parsed.hostname:
                raise ValueError("OIDC and public origins require HTTP(S)")
            if parsed.username or parsed.query or parsed.fragment:
                raise ValueError("Public origins and issuer must not contain credentials or query")
            if parsed.scheme != "https" and (
                self.environment == "production"
                or parsed.hostname not in {"localhost", "127.0.0.1"}
            ):
                raise ValueError("HTTP is permitted only on loopback outside production")
        if bool(self.oidc_issuer) != bool(self.oidc_client_id):
            raise ValueError("OIDC issuer and client ID must be configured together")
        if self.environment == "production" and not self.oidc_issuer:
            raise ValueError("Production requires OIDC configuration")
        if not 1 <= self.session_hours <= 24:
            raise ValueError("Session duration must be 1–24 hours")
        if not 1 <= self.diagnostic_limit <= 60 or not 1 <= self.mutation_limit <= 600:
            raise ValueError("Invalid rate limits")
        if not self.database_url.get_secret_value().startswith("postgresql+psycopg://"):
            raise ValueError("PostgreSQL with psycopg is required")
        if self.environment == "production":
            query = parse_qs(urlsplit(self.database_url.get_secret_value()).query)
            if query.get("sslmode") != ["verify-full"]:
                raise ValueError("Production database connections require sslmode=verify-full")
            if not self.redis_url.get_secret_value().startswith("rediss://"):
                raise ValueError("Production Redis connections require TLS (rediss)")
        return self

    @property
    def secure_cookie(self):
        return self.api_origin.startswith("https://")

    @property
    def cookie_name(self):
        return "__Host-devpulse" if self.secure_cookie else "devpulse_session"

    @property
    def callback_url(self):
        return f"{self.api_origin}/api/v1/auth/callback"


@lru_cache
def get_settings():
    return Settings()
