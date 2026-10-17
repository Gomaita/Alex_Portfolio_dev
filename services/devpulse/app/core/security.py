import hashlib
import secrets
from dataclasses import dataclass

from fastapi import Depends, Request
from redis.exceptions import RedisError
from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.core.errors import APIError
from app.db.models import Session, User, now
from app.db.session import get_db


def digest(value: str):
    return hashlib.sha256(value.encode()).hexdigest()


def csrf_for(token: str):
    # Domain separation: CSRF cannot be used as a session token or inverted.
    return digest("devpulse:csrf:" + token)


@dataclass
class Identity:
    user: User
    session: Session
    csrf: str


def identity(request: Request, db: DBSession = Depends(get_db)):
    settings = request.app.state.settings
    token = request.cookies.get(settings.cookie_name, "")
    if not token or len(token) > 128:
        raise APIError(401, "unauthenticated", "Sign in to continue.")
    row = db.execute(
        select(Session, User)
        .join(User)
        .where(
            Session.token_hash == digest(token), Session.expires_at > now(), User.status == "active"
        )
    ).first()
    if not row:
        raise APIError(401, "session_expired", "Your session has expired. Sign in again.")
    session, user = row
    return Identity(user, session, csrf_for(token))


def rate_limit(request: Request, key: str, limit: int, seconds: int = 60):
    # Atomic expiry and increment; shared by every API process; fail closed.
    try:
        count = request.app.state.redis.eval(
            "local n=redis.call('INCR',KEYS[1]); "
            "if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
            1,
            "devpulse:rate:" + digest(key),
            seconds,
        )
    except RedisError as exc:
        raise APIError(503, "rate_limit_unavailable", "Please try again later.", True) from exc
    if count > limit:
        raise APIError(429, "rate_limited", "Too many requests. Try again in one minute.", True)


def mutation(request: Request, auth: Identity = Depends(identity)):
    settings = request.app.state.settings
    supplied = request.headers.get("x-csrf-token", "")
    if request.headers.get("origin") != settings.frontend_origin or not secrets.compare_digest(
        digest(supplied), auth.session.csrf_hash
    ):
        raise APIError(403, "csrf_rejected", "Refresh the page before trying again.")
    rate_limit(request, f"mutation:{auth.user.id}", settings.mutation_limit)
    return auth
