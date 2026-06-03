# Security Notes

## 1. Demo Vs Production

The current demos are educational and are not production systems.

## 2. User-Generated Content Risk

If visitors can submit content, it must not become public automatically. Public submission features need moderation before anything is shown to other visitors.

## 3. Moderation-First Approach

Everything submitted publicly should start as pending and private. Only approved records should become public.

## 4. Passwords

The Secure Users demo is educational. Real passwords should never be handled only in frontend code or stored in `localStorage`.

Real password hashing must happen server-side using production-ready algorithms and parameters.

## 5. Sanitization

Frontend validation is useful for user experience, but backend validation is mandatory. The backend must validate length, required fields, allowed values and unsafe content.

## 6. Admin Endpoints

Never expose admin secrets in frontend code. Any admin token or secret must stay in server-side environment variables.

## 7. Data Retention

The backend should allow deleting or rejecting user submissions. Deleted or rejected content should not appear publicly.

## 8. Recommended Production Protections

- Cloudflare Turnstile
- Rate limiting
- Server-side validation
- Moderation queue
- Audit logs
- Environment secrets
- Backups

## 9. Backend Validation

Backend validation is mandatory. Frontend validation is only a user experience improvement and cannot be trusted for security.

## 10. Moderation Queue

The moderation queue prevents public spam and unsafe user-generated content. Public submissions should stay pending/private until reviewed.

## 11. Admin Token Handling

The admin token must never be exposed to frontend code. Do not create `VITE_ADMIN_TOKEN` or similar public variables. Admin secrets belong only in Cloudflare backend secrets.

## 12. Scaling Public Submissions

Use Turnstile before accepting public submissions at scale. Consider rate limiting and avoid storing raw IP addresses if they are not needed.

## 13. Soft Delete Vs Hard Delete

Soft delete keeps a record marked as deleted or archived so admins can audit what happened. Hard delete removes the record entirely. For moderation workflows, soft delete is usually safer because it supports review and audit history.
