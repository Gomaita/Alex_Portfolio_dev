# Backend Plan

This project is prepared for a first real backend version using Cloudflare Pages Functions and Cloudflare D1.

The backend is not meant to connect every demo. It focuses on two practical flows:

- Contact messages.
- Project submissions with manual moderation.

The frontend remains safe to run without the backend because `VITE_BACKEND_ENABLED` is disabled by default.

## Cloudflare Pages Functions

The backend routes live in `functions/` and follow the Cloudflare Pages Functions format:

- `onRequestPost`
- `onRequestGet`
- `onRequestPatch`
- `onRequestDelete`

No Express server or Node server is required.

## D1 Binding

The expected D1 binding is:

```js
context.env.DB
```

If the binding is missing, endpoints return:

```text
Database binding is not configured.
```

The database schema is in:

```text
db/schema.sql
```

## Endpoints

Public endpoints:

- `POST /api/contact`
- `POST /api/project-submissions`
- `GET /api/projects/public`

Admin endpoints:

- `GET /api/admin/project-submissions`
- `PATCH /api/admin/project-submissions`
- `DELETE /api/admin/project-submissions`
- `GET /api/admin/contact-messages`
- `PATCH /api/admin/contact-messages`
- `DELETE /api/admin/contact-messages`

## Moderation Flow

Visitor submissions always start as:

```text
moderation_status = pending
visibility = private
```

Nothing submitted by visitors appears publicly until an admin approves it.

Public project reads only return rows where:

```text
moderation_status = approved
visibility = public
deleted_at IS NULL
```

The public endpoint does not return `submitter_email`, `admin_notes` or internal moderation fields.

## Contact Messages

Contact messages are stored privately with:

```text
status = new
```

They are never exposed through a public endpoint.

## Email Notifications

`POST /api/contact` stores messages in D1 first. After the message is stored, the Function can send an email notification through Resend.

Contact email notifications are sent with a structured HTML email including sender information, message content and technical details.

Required Cloudflare Pages backend variables:

```text
RESEND_API_KEY
CONTACT_NOTIFICATION_EMAIL
CONTACT_EMAIL_FROM
```

`RESEND_API_KEY` is used only inside Cloudflare Pages Functions. Do not expose it in frontend code and do not create a `VITE_` variable for it.

If `RESEND_API_KEY` or `CONTACT_NOTIFICATION_EMAIL` is missing, the endpoint skips email notification and still returns a normal success response after saving the message.

If Resend fails after D1 storage succeeds, the endpoint logs a safe warning and still returns:

```json
{ "ok": true, "message": "Message received." }
```

## Admin Protection

Admin endpoints require:

```text
Authorization: Bearer <token>
```

The token must come from `context.env.ADMIN_API_TOKEN`.

Do not expose this token in frontend code and do not create a `VITE_` variable for it.

## Deployment Steps

1. Create a Cloudflare D1 database.
2. Apply `db/schema.sql`.
3. Add the D1 binding `DB` to the Cloudflare Pages project.
4. Add `ADMIN_API_TOKEN` as a backend secret/environment variable.
5. Add `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` and optionally `CONTACT_EMAIL_FROM`.
6. Set `VITE_BACKEND_ENABLED=true`.
7. Redeploy the Cloudflare Pages project.
8. Test `POST /api/contact`.
9. Test `POST /api/project-submissions`.
10. Test admin endpoints using a secure API client.

## Local Frontend Config

Use `.env.example` as a reference:

```text
VITE_API_BASE_URL=
VITE_BACKEND_ENABLED=false
VITE_DEMO_MODE=true
VITE_OPENWEATHER_API_KEY=
```

When deployed on the same Cloudflare Pages domain, `VITE_API_BASE_URL` can stay empty and the frontend will call relative `/api/...` routes.
