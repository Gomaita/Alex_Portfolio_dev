# Security Notes

This backend is designed as a first safe version for a junior portfolio project. It is prepared for Cloudflare Pages Functions and D1, but it should still be treated as an early backend.

## Validation

Frontend validation is only for user experience.

Backend validation is mandatory because visitors can bypass frontend code. The Functions validate and sanitize contact messages and project submissions before writing to D1.

## Sanitization

Submitted text is trimmed, repeated spaces are normalized and control characters are removed.

The backend rejects obvious risky content such as:

- `<script`
- HTML-like tags
- `javascript:`
- inline event handlers such as `onclick=`

## Moderation

Moderation protects the public site from spam or unsafe content.

Project submissions start as:

```text
moderation_status = pending
visibility = private
```

Only approved and public projects can be returned by the public endpoint.

Contact messages are private and are not exposed publicly.

## Admin Token

Admin endpoints require an `Authorization: Bearer` token.

The admin token must be configured only as a Cloudflare Pages secret/environment variable:

```text
ADMIN_API_TOKEN
```

Never expose the admin token in frontend code.
Never create a public `VITE_` variable for admin authentication.
Never put the admin token in `.env.example`.

## Demo Scope

The demos in this portfolio are educational. They are not production systems.

This backend prepares real storage and moderation, but real authentication, role management, abuse prevention and admin tooling are future work.

## Before Accepting Public Submissions At Scale

Add additional protections before relying on this for high-volume public submissions:

- Cloudflare Turnstile.
- Rate limiting.
- Better audit dashboards.
- Real admin authentication.
- Monitoring and alerting.
- More detailed abuse review.
