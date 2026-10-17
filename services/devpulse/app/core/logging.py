import asyncio
import json
import logging
import time
import uuid

from starlette.responses import JSONResponse

logger = logging.getLogger("devpulse")


class RequestBoundary:
    """Bound even chunked payloads before parsing. Never log URL queries, bodies or headers."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        request_id = str(uuid.uuid4())
        scope.setdefault("state", {})["request_id"] = request_id
        body = bytearray()
        deadline = time.monotonic() + 10
        while True:
            try:
                message = await asyncio.wait_for(
                    receive(), timeout=max(0.001, deadline - time.monotonic())
                )
            except TimeoutError:
                response = JSONResponse(
                    {
                        "error": {
                            "code": "request_timeout",
                            "message": "Request body timed out.",
                            "request_id": request_id,
                            "retryable": True,
                        }
                    },
                    status_code=408,
                    headers={"X-Request-ID": request_id, "Cache-Control": "no-store"},
                )
                return await response(scope, receive, send)
            if message["type"] == "http.disconnect":
                return
            chunk = message.get("body", b"")
            if len(body) + len(chunk) > 16384:
                response = JSONResponse(
                    {
                        "error": {
                            "code": "payload_too_large",
                            "message": "Request exceeds 16 KiB.",
                            "request_id": request_id,
                            "retryable": False,
                        }
                    },
                    status_code=413,
                    headers={"X-Request-ID": request_id, "Cache-Control": "no-store"},
                )
                return await response(scope, receive, send)
            body.extend(chunk)
            if not message.get("more_body", False):
                break
        supplied = False
        status = 500
        started = False
        start = time.monotonic()

        async def replay():
            nonlocal supplied
            if supplied:
                return await receive()
            supplied = True
            return {"type": "http.request", "body": bytes(body), "more_body": False}

        async def safe_send(message):
            nonlocal status, started
            if message["type"] == "http.response.start":
                started = True
                status = message["status"]
                message["headers"] += [
                    (b"x-request-id", request_id.encode()),
                    (b"cache-control", b"no-store"),
                    (b"x-content-type-options", b"nosniff"),
                    (b"referrer-policy", b"no-referrer"),
                ]
            await send(message)

        try:
            await self.app(scope, replay, safe_send)
        except Exception:
            # Do not pass unexpected exception contents to the server's traceback logger.
            if not started:
                response = JSONResponse(
                    {
                        "error": {
                            "code": "internal_error",
                            "message": "Request could not be completed.",
                            "request_id": request_id,
                            "retryable": False,
                        }
                    },
                    status_code=500,
                )
                await response(scope, replay, safe_send)
        finally:
            route = scope.get("route")
            logger.info(
                json.dumps(
                    {
                        "event": "request",
                        "request_id": request_id,
                        "method": scope["method"],
                        "route": getattr(route, "path", "unmatched"),
                        "status": status,
                        "duration_ms": round((time.monotonic() - start) * 1000, 2),
                    }
                )
            )
