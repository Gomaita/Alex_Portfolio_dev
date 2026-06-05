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

## Email Notification Secrets

`RESEND_API_KEY` must never be exposed in frontend code.

Do not create `VITE_` variables for email notification secrets. Resend credentials, notification recipients and verified sender addresses belong in Cloudflare Pages backend environment variables/secrets.

User-provided contact content must be escaped before it is inserted into email HTML.

Email notification failure must not lose a stored contact message. `/api/contact` saves to D1 first, then tries to send the notification.

## Demo Scope

The demos in this portfolio are educational. They are not production systems.

This backend prepares real storage and moderation, but real authentication, role management, abuse prevention and admin tooling are future work.

## Health And Metrics Safety

Metrics endpoints must not expose private records. They should return aggregate counts and high-level timestamps only.

Health checks must not expose stack traces, SQL details, tokens, emails, messages or internal private data.

Admin tokens must never be available in frontend code.

## Educational Auth And Checkout Demos

Auth Flow Simulator is not real authentication. It exists to explain frontend auth states, roles, permission checks and session expiration.

Checkout Flow Simulator does not process payments. Do not enter real payment data.

No real cards or real passwords should be stored in these demos. Real applications need backend-side authentication, secure session handling, server-side validation, payment provider tokenization and careful audit logging.

## Security Lab Scope

Security Operations Center Lite is a defensive security simulation.

It should not be used as a real firewall, monitoring system or traffic inspection tool. It uses simulated events and documentation IP ranges only.

The lab intentionally avoids real visitor traffic inspection, real IP logs, private logs, external URL scanning and offensive behavior. A production security monitoring system would need careful logging rules, retention limits, access control, privacy review and incident response procedures.

## Blockchain Lab Scope

Blockchain Lab is an educational smart contract simulation.

It should not be used as production smart contract code. The Solidity snippets are simplified for learning and are not reviewed as deployable contract code.

The lab does not connect real wallets, request wallet addresses, use real funds, deploy contracts, call testnets, call mainnet or submit transactions. A real smart contract project would require tests, professional audits, deployment reviews, key management, monitoring and careful incident planning.

## Before Accepting Public Submissions At Scale

Add additional protections before relying on this for high-volume public submissions:

- Cloudflare Turnstile.
- Rate limiting.
- Better audit dashboards.
- Real admin authentication.
- Monitoring and alerting.
- More detailed abuse review.
