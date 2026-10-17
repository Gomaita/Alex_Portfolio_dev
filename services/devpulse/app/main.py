import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from redis import Redis
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException
from starlette.middleware.cors import CORSMiddleware

from app.api.v1.router import router
from app.core.config import get_settings
from app.core.errors import APIError
from app.core.logging import RequestBoundary
from app.db.session import database
from app.services.oidc import OIDC


def create_app(settings=None):
    settings = settings or get_settings()
    engine, sessions = database(settings.database_url.get_secret_value())
    redis = Redis.from_url(
        settings.redis_url.get_secret_value(),
        socket_timeout=3,
        socket_connect_timeout=3,
        decode_responses=True,
    )

    @asynccontextmanager
    async def lifespan(app):
        logging.basicConfig(level=logging.INFO, format="%(message)s")
        # Prevent HTTP client request logs from disclosing provider callback material.
        logging.getLogger("httpx").setLevel(logging.WARNING)
        yield
        redis.close()
        engine.dispose()

    app = FastAPI(
        title="DevPulse API",
        version="0.2.0",
        lifespan=lifespan,
        docs_url="/docs" if settings.environment != "production" else None,
        redoc_url=None,
        openapi_url="/openapi.json" if settings.environment != "production" else None,
    )
    app.state.settings, app.state.sessions, app.state.redis = settings, sessions, redis
    app.state.oidc = OIDC(settings)
    app.include_router(router)
    original_openapi = app.openapi

    def documented_openapi():
        schema = original_openapi()
        schema["components"].setdefault("securitySchemes", {})["SessionCookie"] = {
            "type": "apiKey",
            "in": "cookie",
            "name": settings.cookie_name,
            "description": (
                "Server-issued OIDC session. Mutations also require Origin "
                "and X-CSRF-Token from /me."
            ),
        }
        public = {"/api/v1/health", "/api/v1/ready", "/api/v1/auth/login", "/api/v1/auth/callback"}
        for path, methods in schema["paths"].items():
            if path not in public:
                for operation in methods.values():
                    operation["security"] = [{"SessionCookie": []}]
        return schema

    app.openapi = documented_openapi

    async def error_response(request: Request, error):
        if isinstance(error, APIError):
            status, code, message, retryable = (
                error.status,
                error.code,
                error.message,
                error.retryable,
            )
        elif isinstance(error, RequestValidationError):
            status, code, message, retryable = (
                422,
                "validation_error",
                "Check the submitted fields.",
                False,
            )
        elif isinstance(error, HTTPException):
            status, code, message, retryable = (
                error.status_code,
                "http_error",
                "Request rejected.",
                False,
            )
        elif isinstance(error, SQLAlchemyError):
            status, code, message, retryable = (
                503,
                "database_unavailable",
                "Please try again later.",
                True,
            )
        else:
            status, code, message, retryable = (
                500,
                "internal_error",
                "Request could not be completed.",
                False,
            )
        payload = {
            "code": code,
            "message": message,
            "retryable": retryable,
            "request_id": getattr(request.state, "request_id", ""),
        }
        if isinstance(error, RequestValidationError):
            payload["fields"] = [".".join(map(str, item["loc"])) for item in error.errors()]
        headers = {"Retry-After": "60"} if status == 429 else {}
        return JSONResponse({"error": payload}, status_code=status, headers=headers)

    for exception in (APIError, RequestValidationError, HTTPException, SQLAlchemyError, Exception):
        app.add_exception_handler(exception, error_response)
    app.add_middleware(RequestBoundary)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["Content-Type", "X-CSRF-Token", "Idempotency-Key"],
        expose_headers=["X-Request-ID", "Retry-After", "Location"],
    )
    return app
