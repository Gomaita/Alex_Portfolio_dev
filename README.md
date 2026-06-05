# Alex Gomez Portfolio

Live site: https://alexgl.dev

## Overview

This is my personal portfolio as a Junior Software Developer with a background in Multimedia Engineering, 3D and VR.

I built it to practice and show small but complete software projects. Some demos use real backend endpoints, while others are educational simulations. The goal is to make the project practical, readable and easy to inspect.

## Purpose

This portfolio is not just a static page. I use it as a place to keep learning and to show how I work with React, APIs, forms, SQL concepts, Cloudflare D1, localStorage and clear UI states.

I am still improving it, but I wanted it to feel honest: simple where it should be simple, and detailed enough to explain the thinking behind each demo.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Framer Motion
- Recharts
- Lucide React
- Cloudflare Pages Functions
- Cloudflare D1
- Resend for contact email notifications

## Main Features

- Responsive portfolio layout.
- Light and dark mode.
- Project pages with practical demo explanations.
- Programming cheatsheets.
- Two CV download options.
- Contact form connected to Cloudflare Pages Functions and D1.
- Structured contact email notifications with Resend.
- Backend-ready moderated project submissions.
- Educational demos for APIs, CRUD, auth concepts, checkout states, SQL concepts and backend monitoring.
- Security Lab with a defensive Security Operations Center Lite simulation.
- Blockchain Lab with an educational smart escrow and contract security simulation.

## Demo Disclaimer

The demos are built for learning and portfolio review.

Some demos use real API endpoints, such as Weather Search App, Market API Dashboard, API Health Monitor and D1 Database Metrics. Other demos are simulations that explain frontend or security concepts without pretending to be full production systems.

Security-related demos are educational. Real applications need backend-side authentication, secure sessions, server-side validation, monitoring and a proper security review.

Market API Dashboard caches historical ranges in `sessionStorage`. Day, month and year charts are loaded on demand and reused during the browser session. Live mode uses one shared market refresh per minute for all listed coins, which helps reduce repeated CoinGecko calls and avoids hitting public API limits too quickly.

Security Operations Center Lite is a defensive simulation. It does not inspect real visitor traffic, expose private logs or scan external services. It is built to practice firewall-style rule evaluation, suspicious request detection, risk scoring and incident review.

Smart Escrow & Contract Security Dashboard is an educational Web3 simulation. It does not use real wallets, real funds or deployed contracts. It practices smart contract states, role permissions, event logs, dispute workflow, milestone payments and contract security concepts.

## Current Demos

- Weather Search App: autocomplete, Open-Meteo data, current conditions and daily high/low temperatures.
- Market API Dashboard: multiple crypto assets, adaptive chart scaling, cached historical ranges and session-based Live chart.
- Security Operations Center Lite: defensive security lab with simulated traffic, firewall rules, request evaluation, incidents and reporting.
- Smart Escrow & Contract Security Dashboard: Web3 learning lab with escrow workflow, contract state machine, simulated event log and risk analyzer.
- API Health Monitor: backend readiness checks without exposing private records.
- D1 Database Metrics: aggregate metrics from D1 without returning private messages or emails.
- Auth Flow Simulator: login states, roles, permissions and session expiration using visible demo data.
- Checkout Flow Simulator: form validation and payment states without processing real payments.
- Project Manager CRUD: local client/admin workflow with moderation states.
- SQL Query Playground: database concepts using prepared example data.
- Secure Users & Roles Demo: educational user records and password hashing concepts.

## Backend Preparation

The project includes a first backend version prepared for Cloudflare Pages Functions and Cloudflare D1.

Main backend pieces:

- `functions/` for Cloudflare Pages Functions.
- `db/schema.sql` for D1/SQLite tables and indexes.
- `docs/BACKEND_PLAN.md` for setup notes.
- `docs/SECURITY_NOTES.md` for security notes.
- `src/services/` for frontend API helpers.
- `.env.example` as a safe local reference.

Backend support is controlled by:

```text
VITE_BACKEND_ENABLED=false
```

When it is enabled and deployed on the same Cloudflare Pages domain, the frontend can call relative `/api/...` routes.

## Email Notifications

`POST /api/contact` stores the message in D1 first. If Resend is configured in Cloudflare Pages, the Function then sends a structured HTML email notification with sender details, message content and technical metadata.

If Resend is missing or fails after D1 storage succeeds, the contact form still returns a success response. The stored message is not lost because email is treated as a secondary step.

Required backend variables:

```text
RESEND_API_KEY=
CONTACT_NOTIFICATION_EMAIL=
CONTACT_EMAIL_FROM=
```

These variables belong only in Cloudflare Pages backend environment variables or secrets. They should not be prefixed with `VITE_`.

## Environment Variables

Use `.env.example` as a reference and create a local `.env` file only when needed.

```text
VITE_API_BASE_URL=
VITE_BACKEND_ENABLED=false
VITE_DEMO_MODE=true
VITE_OPENWEATHER_API_KEY=
```

Do not commit real tokens, API keys, passwords or production secrets.

`ADMIN_API_TOKEN`, `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` and `CONTACT_EMAIL_FROM` must stay in backend environment variables/secrets, not in frontend code.

## Running Locally

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

## Build

The Vite build output is generated in:

```text
dist/
```

`dist/` is ignored by git and should be generated during deployment.

## Deployment

The project is intended to run on Cloudflare Pages with:

- Build command: `npm run build`
- Output directory: `dist`
- Custom domain: `https://alexgl.dev`
- Pages Functions in `functions/`
- D1 binding named `DB`

Backend secrets and environment variables are configured in Cloudflare, not committed to the repository.

## CV Downloads

The site includes two CV download options:

- ATS CV: `/Alex_Gomez_CV_ATS.pdf`
- Visual CV: `/Alex_Gomez_CV_Visual.pdf`

The PDFs live in `public/` and are served as downloadable files. Their content is not copied into the website.

## Project Structure

```text
src/
  components/
    security-lab/
    blockchain-lab/
  config/
  data/
  hooks/
  pages/
  services/
  utils/

functions/
  api/
  _utils/

public/
  Alex_Gomez_CV_ATS.pdf
  Alex_Gomez_CV_Visual.pdf

docs/
db/
```

## Repository Notes

This repository does not include private environment variables or production secrets.
Use `.env.example` as a reference and create a local `.env` file only when needed.

## What This Portfolio Demonstrates

- Building React interfaces with reusable components.
- Handling loading, empty, error and success states.
- Working with public APIs through backend proxy endpoints.
- Using Cloudflare Pages Functions and D1 for a small backend.
- Keeping private data out of public endpoints.
- Documenting demos honestly, including their limits.
- Making a portfolio that is easy to read, test and improve.

## Future Improvements

- Add Cloudflare Turnstile to public forms.
- Add stronger admin authentication.
- Add server-side caching for public API requests.
- Add more automated tests.
- Improve manual QA documentation.
- Keep refining the demos as I learn more.
