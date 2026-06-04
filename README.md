# Alex Gomez Portfolio

Live site: https://alexgl.dev

Personal portfolio built to present my work as a junior software developer with a background in Multimedia Engineering, 3D and VR.

The goal of this project is simple: show what I am learning, keep the code readable, and document small practical demos that connect frontend, data, UI and backend-ready ideas.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Cloudflare Pages-ready frontend
- Cloudflare Pages Functions-ready backend structure
- Cloudflare D1 SQL schema

## Features

- Responsive portfolio layout.
- Light and dark mode.
- Project pages with demo-focused explanations.
- Educational frontend demos.
- Programming cheatsheets.
- CV download options.
- Contact page with optional backend submission.
- Backend-ready structure for moderated public submissions.
- API Health Monitor.
- D1 Database Metrics Dashboard.
- Auth Flow Simulator.
- Checkout Flow Simulator.
- Documentation for backend, security and deployment preparation.

## Educational Demos

This portfolio includes small demos built for practice and learning. They are designed to show frontend logic, state management, data handling and UI decisions in a clear way.

The demos remain educational and local by default. The backend is prepared for contact messages and project submissions, but the demos are not all connected to backend storage.

Weather Search App now includes city autocomplete, external weather/geocoding API integration, backend proxy endpoints and improved error handling.

Market API Dashboard now includes multiple crypto assets, historical chart ranges, a selected coin view, public API data normalization and a live session chart.

API Health Monitor checks backend readiness, D1 connectivity and response times without exposing private records.

D1 Database Metrics Dashboard reads aggregated counts from Cloudflare D1 and visualizes them without exposing messages, emails or user details.

Auth Flow Simulator explains login states, session expiration, roles and protected views without implementing real authentication.

Checkout Flow Simulator practices checkout UX, form validation and fake payment states without processing real payments or storing card data.

## Backend-Ready Cloudflare Structure

The project includes a first backend version prepared for Cloudflare Pages Functions and Cloudflare D1.

It includes:

- `functions/` for Cloudflare Pages Functions.
- `db/schema.sql` for D1/SQLite tables and indexes.
- `docs/BACKEND_PLAN.md` for setup notes.
- `docs/SECURITY_NOTES.md` for security notes.
- `src/services/` for frontend API helpers.
- `.env.example` as a safe reference for local environment variables.

Backend support is disabled by default with:

```text
VITE_BACKEND_ENABLED=false
```

When enabled and deployed on the same Cloudflare Pages domain, the frontend can call relative `/api/...` routes.

## Moderated Submissions

Visitor project submissions are moderation-first.

Every public submission starts as:

```text
moderation_status = pending
visibility = private
```

Nothing submitted by a visitor appears publicly until it is approved by an admin.

The public projects endpoint only returns approved and public rows.

## Contact Messages

The contact form can send messages to the backend when `VITE_BACKEND_ENABLED=true`.

When the backend is disabled, the UI shows a friendly message and keeps the email link as the safe contact option.

## Email Notifications

`/api/contact` stores contact messages in D1 first.

If Resend is configured in Cloudflare Pages, the Function also sends an email notification when a new message arrives. The form still works if email notifications are not configured or if the email request fails after the message has been saved.

Contact email notifications are sent with a structured HTML email including sender information, message content and technical details.

Required backend variables:

```text
RESEND_API_KEY=
CONTACT_NOTIFICATION_EMAIL=
CONTACT_EMAIL_FROM=
```

These are backend environment variables for Cloudflare Pages Functions. Do not prefix them with `VITE_` and do not expose them in frontend code.

## Environment Variables

Use `.env.example` as a reference and create a local `.env` file only when needed.

```text
VITE_API_BASE_URL=
VITE_BACKEND_ENABLED=false
VITE_DEMO_MODE=true
VITE_OPENWEATHER_API_KEY=
```

Do not commit real tokens, API keys, passwords or production secrets.

Do not put `ADMIN_API_TOKEN` in frontend variables. `VITE_` variables are exposed to the browser.

`ADMIN_API_TOKEN` must be configured only as a Cloudflare Pages secret/environment variable for Functions.

Email notification variables such as `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` and `CONTACT_EMAIL_FROM` must also be configured only in Cloudflare Pages backend environment variables/secrets.

## Cloudflare D1 Setup

To activate the backend:

1. Create a Cloudflare D1 database.
2. Apply `db/schema.sql`.
3. Add a D1 binding called `DB` to the Cloudflare Pages project.
4. Add `ADMIN_API_TOKEN` as a backend secret/environment variable.
5. Add Resend email notification variables if you want contact email alerts.
6. Set `VITE_BACKEND_ENABLED=true`.
7. Redeploy the project.
8. Test the public endpoints.
9. Test admin endpoints from a secure API client.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## CV Downloads

The site includes two CV download options:

- ATS CV: `/Alex_Gomez_CV_ATS.pdf`
- Visual CV: `/Alex_Gomez_CV_Visual.pdf`

The PDFs live in `public/` and are served as downloadable files. Their content is not copied into the website.

## Demo Disclaimer

The demos in this portfolio are educational and portfolio-focused. They are not production systems.

Security-related demos are meant to explain concepts and show structure, not to replace a real production security review.

## Repository Notes

This repository does not include private environment variables or production secrets.
Use `.env.example` as a reference and create a local `.env` file only when needed.

## Project Structure

```text
src/
  components/
  config/
  data/
  hooks/
  pages/
  services/

functions/
  api/
  _utils/

public/
  Alex_Gomez_CV_ATS.pdf
  Alex_Gomez_CV_Visual.pdf

docs/
db/
```

## About

I built this project as a junior developer portfolio: something practical, personal and easy to explain. It is a place to collect what I am learning and keep improving it step by step.
