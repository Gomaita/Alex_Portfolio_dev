# Backend and Database Plan

## 1. Goal

The current portfolio contains frontend educational demos. The backend plan is for controlled future features such as contact messages, moderated project submissions and admin review tools.

The goal is not to turn every demo into shared public data. By default, demos should remain local or simulated unless a specific feature is intentionally connected to a protected backend.

## 2. Proposed Stack

- React/Vite frontend
- Cloudflare Pages or Workers
- Cloudflare Functions/Workers API routes
- Cloudflare D1 database
- Environment variables for configuration and secrets

## 3. Important Security Rule

No public user-generated content should become visible without moderation.

## 4. Public Submissions Flow

1. A visitor submits a project proposal or contact message.
2. The backend validates and sanitizes the input.
3. The record is stored as pending and private.
4. An admin reviews it in a protected moderation area.
5. Only approved records can become public.
6. Rejected or deleted records never appear publicly.

## 5. Suggested Database Schema

```sql
CREATE TABLE IF NOT EXISTS project_submissions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT,
  category TEXT NOT NULL,
  technologies TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  visibility TEXT NOT NULL DEFAULT 'private',
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  approved_at TEXT,
  rejected_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL,
  metadata TEXT
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 6. Validation Rules

- Limit title length.
- Limit description and message length.
- Accept only allowed categories.
- Validate email format.
- Reject HTML/script-like content.
- Trim whitespace.
- Normalize repeated spaces.
- Reject empty submissions.

## 7. Anti-Spam Protection

- Add a honeypot field.
- Add simple rate limiting.
- Use Cloudflare Turnstile in the future.
- Store an IP/user-agent hash instead of raw IP where possible.
- Route all public submissions through a moderation queue.

## 8. Future API Endpoints

- `POST /api/project-submissions`
- `GET /api/projects/public`
- `GET /api/admin/project-submissions`
- `PATCH /api/admin/project-submissions/:id/approve`
- `PATCH /api/admin/project-submissions/:id/reject`
- `DELETE /api/admin/project-submissions/:id`
- `POST /api/contact`
- `GET /api/admin/contact-messages`

## 9. Admin Protection

Admin endpoints must not be exposed publicly without protection.

An environment-stored admin token could be used as a temporary first step, but it must never be placed in frontend code. Later, this should move to proper authentication.

## 10. What Should Stay Local/Demo

Project Manager CRUD, Secure Users & Roles Demo and SQL Query Playground can remain frontend educational demos unless they are intentionally connected to the backend.

## 11. Deployment Notes For Cloudflare

Cloudflare D1 should be connected through Cloudflare bindings. Public frontend environment variables can use `VITE_`, but server secrets must stay in Cloudflare environment variables and must not be exposed to browser code.

## 12. Implemented Backend Preparation

The repository now includes a first Cloudflare Pages Functions backend structure:

- `functions/api/contact.js`
- `functions/api/project-submissions.js`
- `functions/api/projects/public.js`
- `functions/api/admin/project-submissions.js`
- `functions/api/admin/contact-messages.js`
- `functions/_utils/`

The D1 database binding is expected as `env.DB`.

Admin endpoints expect an environment secret named `ADMIN_API_TOKEN` and require an `Authorization: Bearer <token>` header.

Public submissions start as pending and private. Contact messages are stored for review and are not exposed publicly. Public project listings only return approved/public project submissions.

The schema lives in `db/schema.sql`.

## 13. Next Deployment Steps

1. Create a Cloudflare D1 database.
2. Apply `db/schema.sql`.
3. Configure the `DB` binding.
4. Configure `ADMIN_API_TOKEN` as a backend secret.
5. Deploy the frontend to Cloudflare Pages.
6. Set `VITE_BACKEND_ENABLED=true` only when the API is ready.
7. Test contact message submission.
8. Test project submission.
9. Test admin moderation using secure tooling.

## 14. Future Improvements

- Real authentication
- Admin dashboard
- Cloudflare Turnstile
- Rate limiting with KV or Durable Objects if needed
- Server-side password hashing if real users exist
- Tests
