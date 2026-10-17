"""OIDC authorization-code adapter: fixed issuer, PKCE S256, nonce, RS256 ID tokens.

No development identity override. Tests use locally generated signing keys.
"""

import base64
import hashlib
import secrets
from datetime import timedelta
from urllib.parse import urlencode, urlsplit

import httpx
import jwt
from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import insert

from app.core.errors import APIError
from app.core.security import csrf_for, digest
from app.db.models import LoginAttempt, Session, User, now


def challenge(verifier):
    return (
        base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    )


class OIDC:
    def __init__(self, settings):
        self.settings = settings

    def endpoint(self, value):
        parsed = urlsplit(value)
        if parsed.username or parsed.fragment or not parsed.hostname:
            raise ValueError("Invalid provider endpoint")
        if parsed.scheme != "https" and not (
            self.settings.environment != "production"
            and parsed.scheme == "http"
            and parsed.hostname in {"localhost", "127.0.0.1"}
        ):
            raise ValueError("Insecure provider endpoint")
        return value

    def discovery(self, client):
        if not self.settings.oidc_issuer:
            raise APIError(503, "auth_not_configured", "Identity provider is not configured.")
        response = client.get(
            self.settings.oidc_issuer.rstrip("/") + "/.well-known/openid-configuration"
        )
        response.raise_for_status()
        data = response.json()
        if data.get("issuer") != self.settings.oidc_issuer:
            raise ValueError("Issuer mismatch")
        for key in ("authorization_endpoint", "token_endpoint", "jwks_uri"):
            self.endpoint(data[key])
        return data

    def begin(self, db):
        with httpx.Client(timeout=8, follow_redirects=False) as client:
            metadata = self.discovery(client)
        state, browser = secrets.token_urlsafe(32), secrets.token_urlsafe(32)
        verifier, nonce = secrets.token_urlsafe(48), secrets.token_urlsafe(32)
        db.execute(delete(LoginAttempt).where(LoginAttempt.expires_at < now()))
        db.add(
            LoginAttempt(
                state_hash=digest(state),
                browser_hash=digest(browser),
                verifier=verifier,
                nonce=nonce,
                expires_at=now() + timedelta(minutes=5),
            )
        )
        db.commit()
        query = urlencode(
            {
                "response_type": "code",
                "client_id": self.settings.oidc_client_id,
                "redirect_uri": self.settings.callback_url,
                "scope": "openid profile email",
                "state": state,
                "nonce": nonce,
                "code_challenge": challenge(verifier),
                "code_challenge_method": "S256",
            }
        )
        return metadata["authorization_endpoint"] + "?" + query, browser

    def verify(self, encoded, jwks, nonce):
        header = jwt.get_unverified_header(encoded)
        if header.get("alg") != "RS256" or not header.get("kid"):
            raise ValueError("Unsupported ID token")
        matches = [
            key
            for key in jwks["keys"]
            if key.get("kid") == header["kid"]
            and key.get("use", "sig") == "sig"
            and key.get("alg", "RS256") == "RS256"
        ]
        if len(matches) != 1:
            raise ValueError("Ambiguous signing key")
        claims = jwt.decode(
            encoded,
            jwt.PyJWK.from_dict(matches[0]).key,
            algorithms=["RS256"],
            issuer=self.settings.oidc_issuer,
            audience=self.settings.oidc_client_id,
            options={"require": ["exp", "iat", "iss", "aud", "sub", "nonce"]},
            leeway=15,
        )
        if not secrets.compare_digest(claims["nonce"], nonce):
            raise ValueError("Invalid nonce")
        audience = claims["aud"]
        if (isinstance(audience, list) and len(audience) > 1) or "azp" in claims:
            if claims.get("azp") != self.settings.oidc_client_id:
                raise ValueError("Invalid authorized party")
        if not isinstance(claims["sub"], str) or not 1 <= len(claims["sub"]) <= 255:
            raise ValueError("Invalid subject")
        return claims

    def finish(self, db, state, browser, code):
        attempt = db.execute(
            delete(LoginAttempt)
            .where(
                LoginAttempt.state_hash == digest(state),
                LoginAttempt.browser_hash == digest(browser),
                LoginAttempt.expires_at > now(),
            )
            .returning(LoginAttempt)
        ).scalar_one_or_none()
        db.commit()  # Consume before exchange, including failed exchanges; callback is single-use.
        if not attempt:
            raise APIError(401, "invalid_login", "Login expired. Start sign-in again.")
        with httpx.Client(timeout=8, follow_redirects=False) as client:
            metadata = self.discovery(client)
            payload = {
                "grant_type": "authorization_code",
                "code": code,
                "client_id": self.settings.oidc_client_id,
                "redirect_uri": self.settings.callback_url,
                "code_verifier": attempt.verifier,
            }
            secret = self.settings.oidc_client_secret
            auth = (self.settings.oidc_client_id, secret.get_secret_value()) if secret else None
            response = client.post(metadata["token_endpoint"], data=payload, auth=auth)
            response.raise_for_status()
            tokens = response.json()
            keys = client.get(metadata["jwks_uri"])
            keys.raise_for_status()
            claims = self.verify(tokens["id_token"], keys.json(), attempt.nonce)
        # Access/refresh tokens are intentionally discarded, never persisted or exposed.
        display = str(claims.get("name") or claims.get("preferred_username") or "Developer")[:160]
        email = claims.get("email") if claims.get("email_verified") is True else None
        statement = insert(User).values(
            issuer=claims["iss"],
            subject=claims["sub"],
            display_name=display,
            email=str(email)[:320] if email else None,
        )
        user = db.execute(
            statement.on_conflict_do_update(
                index_elements=["issuer", "subject"],
                set_={"display_name": display, "updated_at": now()},
            ).returning(User)
        ).scalar_one()
        if user.status != "active":
            db.rollback()
            raise APIError(403, "account_disabled", "This account is disabled.")
        return issue_session(db, user.id, self.settings.session_hours)


def issue_session(db, user_id, hours):
    token = secrets.token_urlsafe(32)
    db.execute(delete(Session).where(Session.expires_at < now()))
    db.add(
        Session(
            token_hash=digest(token),
            user_id=user_id,
            csrf_hash=digest(csrf_for(token)),
            expires_at=now() + timedelta(hours=hours),
        )
    )
    db.commit()
    return token
