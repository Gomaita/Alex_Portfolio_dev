# Code Guide

## Overview

This portfolio is a React + Vite app with a clean light design and an optional dark mode. The goal is to keep the site readable, personal and practical:

- Home introduces Alex and the projects he is building.
- Portfolio is an index, not a wall of demos.
- Project detail pages contain the full demos.
- Cheatsheets are readable reference pages with copyable snippets.
- The theme toggle stores the visitor preference in `localStorage`.

## Visual System

The base visual language is centralized in `src/components/ui`:

- `Button`
- `Card`
- `Badge`
- `Section`
- `PageHeader`
- `EmptyState`
- `DemoNote`

Light mode is the default. Dark mode uses slate surfaces, light text and restrained blue/teal accents.

Shared repeated styles should stay in UI components or in the small semantic classes in `src/index.css`, such as `muted-text`, `subtle-text` and `lab-panel`.

## Routing

`src/App.jsx` defines:

- `/`
- `/portfolio`
- `/portfolio/:slug`
- `/about`
- `/contact`
- `/cheatsheets`
- `/cheatsheets/:slug`

Important project routes include:

- `/portfolio/market-api-dashboard`
- `/portfolio/project-manager-crud`
- `/portfolio/weather-search-app`
- `/portfolio/github-projects-explorer`
- `/portfolio/programming-cheatsheets`
- `/portfolio/sql-query-playground`
- `/portfolio/secure-users-roles-demo`

## Project Flow

`/portfolio` renders filters and project cards only.

`/portfolio/:slug` reads the slug, finds the project in `src/data/projects.js`, renders the project content and loads the demo through `ProjectDemo`.

Supported demo keys:

- `market`
- `crud`
- `weather`
- `github`
- `cheatsheets`
- `sql`
- `secure-users`
- `api-health`
- `d1-metrics`
- `auth-flow`
- `checkout-flow`

## Backend-Ready Architecture

`src/config/appConfig.js` centralizes public app configuration:

- app name
- owner name
- CV links
- contact email
- API base URL
- backend enabled flag
- demo mode flag

`src/services/apiClient.js` is a prepared fetch client for future backend routes. It uses `appConfig.apiBaseUrl`, checks whether backend mode is enabled, handles HTTP errors, handles invalid JSON and applies a simple timeout.

`src/services/backend/` contains placeholders for future Cloudflare Functions/Workers services:

- `projectSubmissionsService.js`
- `contactMessagesService.js`
- `adminModerationService.js`

Weather Search App and Market API Dashboard use public API proxy endpoints. Project Manager CRUD, Secure Users & Roles Demo and SQL Query Playground remain local educational demos unless they are intentionally connected to a protected backend.

User-generated content needs moderation because visitor input can contain spam, offensive content or unsafe data. A future backend should store public submissions as pending/private first, then expose only approved records.

The future D1/SQLite schema lives in `db/schema.sql`.

## Weather Search App

`src/components/WeatherSearchDemo.jsx` renders the weather demo.

`src/services/weatherApi.js` calls the Cloudflare Pages Functions weather endpoints:

- `/api/weather/search`
- `/api/weather/current`

The demo includes city autocomplete, Open-Meteo geocoding, normalized weather responses with daily max/min temperatures, quick cities, debounce, clear city-not-found errors and a controlled fallback for service failures.

## Market API Dashboard

`src/components/MarketDashboard.jsx` renders the crypto market dashboard.

`src/services/marketApi.js` calls the Cloudflare Pages Functions crypto endpoints:

- `/api/crypto/markets`
- `/api/crypto/history`

The dashboard includes multiple crypto assets, search/filter, selected coin summary, historical ranges, adaptive chart scaling, a Recharts line chart and a live session chart. Live mode collects points while the page is open instead of pretending to be real historical minute data. Historical ranges depend on the public CoinGecko API and may be rate limited.

## API Health Monitor

`src/components/demos/APIHealthMonitor.jsx` renders the backend monitoring demo.

It calls `/api/health`, displays service status cards, response times, a small Recharts bar chart and the last five checks stored in `localStorage`.

The endpoint checks D1 readiness and table/query availability without returning private records.

## D1 Database Metrics

`src/components/demos/D1DatabaseMetrics.jsx` renders the aggregated metrics dashboard.

It calls `/api/metrics` and shows contact/project counts, charts and a metric details table. The endpoint returns only aggregate values and timestamps, never emails, messages, admin notes or record IDs.

## Auth Flow Simulator

`src/components/demos/AuthFlowSimulator.jsx` renders an educational auth flow simulator.

It uses visible demo credentials, mock sessions, role-based UI, protected area checks, session expiration controls, a timeline and an event log. It does not send passwords to a backend and it is not real authentication.

## Checkout Flow Simulator

`src/components/demos/CheckoutFlowSimulator.jsx` renders a fake checkout flow.

It includes cart state, customer form validation, demo payment cards, simulated payment outcomes, a fake receipt and an event log. It does not process payments, store card data or send card details to a backend.

## Project Manager CRUD

`src/components/ProjectManagerDemo.jsx` renders the Client / Admin Project Board.

The demo keeps one shared project list in `localStorage` with the key `alex-portfolio-project-manager`. It normalizes saved records on load, so older project entries that only had title, description, technologies and status still receive the newer fields:

- `clientName`
- `clientEmail`
- `approvalStatus`
- `visibility`
- `priority`
- `category`
- `adminNotes`
- `estimatedHours`
- `budgetRange`

Client View is the public-facing side. It lets a user submit a project proposal and only shows projects that are both `Approved` and `Public`.

Admin View is the internal side. It can see every project, search by title/client/email, filter by approval/status/category/priority, approve or reject proposals, change visibility, change status, edit internal notes, edit estimated hours and delete demo projects.

The approval workflow is:

- Client submission starts as `Pending Review`, `Private` and `Planned`.
- Admin approval changes it to `Approved`, sets visibility to `Public` and stores `approvedAt`.
- Admin rejection changes it to `Rejected`, keeps visibility `Private` and adds a default note if none exists.
- Admin edits update `updatedAt`.

This is a frontend CRUD demo, not a real project management backend. Future work would include authentication, backend API, database persistence, user accounts, email notifications and audit history.

## SQL Query Playground

`src/components/demos/SQLQueryPlayground.jsx` renders the database practice demo.

`src/data/sqlPlaygroundData.js` contains static tables and predefined query results. The demo does not execute SQL for real; it explains database concepts visually before connecting to a real backend.

It covers:

- SELECT
- WHERE
- ORDER BY
- GROUP BY
- JOIN

Possible future work: connect SQLite or PostgreSQL, add a real SQL editor, validate custom queries, add schema diagrams and expose a backend API.

## Secure Users & Roles Demo

`src/components/demos/SecureUsersRolesDemo.jsx` renders the educational user management demo.

`src/data/secureUsersDemoData.js` contains the initial demo users, available roles, statuses, suggested skills and security note copy.

`src/services/cryptoService.js` contains the browser-side password record helpers:

- `generateSalt()`
- `hashPassword()`
- `createPasswordRecord()`
- `maskHash()`
- `generateDemoPasswordHashIfNeeded()`

The preferred path uses Web Crypto API with PBKDF2 + SHA-256 and a unique salt per user. If Web Crypto is not available, the demo marks the result as a fallback and still avoids storing the original password.

The demo has two views:

- Client View shows public profile data only: name, role, location, skills, status and registration date. It does not show email, hash, salt or internal notes.
- Moderator View shows the internal educational record: email, status controls, role controls, salt, masked hash, algorithm and internal note.

This is not real production authentication. Real applications should handle authentication, password hashing and permissions on the backend with a real database, server-side session handling and algorithms such as Argon2id, bcrypt or PBKDF2 with proper parameters.

## Add A Project

1. Add an object in `src/data/projects.js`.
2. Include a clear `summary`, practical `skillsDemonstrated`, `technicalNotes` and `improvements`.
3. Set `category` for the portfolio filter.
4. Set `demoComponentKey` if the project has a demo.

## Add A Demo

1. Create the demo component.
2. Import it in `src/components/demos/ProjectDemo.jsx`.
3. Add it to the demo map.
4. Use the same key in `projects.js`.

## Responsive Design Notes

The site should stay readable on mobile, tablet and desktop.

- Cards stack naturally on smaller screens.
- Navigation stays simple and accessible.
- Forms keep readable spacing on mobile.
- Code snippets avoid overflowing the page.
- Buttons remain easy to tap.

Do not expose internal class names or design-token language in visible UI copy.

## Manual Checks

Check these routes:

- `/`
- `/portfolio`
- `/portfolio/market-api-dashboard`
- `/portfolio/project-manager-crud`
- `/portfolio/weather-search-app`
- `/portfolio/github-projects-explorer`
- `/portfolio/programming-cheatsheets`
- `/portfolio/sql-query-playground`
- `/portfolio/secure-users-roles-demo`
- `/cheatsheets`
- `/cheatsheets/python`
- `/cheatsheets/javascript`
- `/cheatsheets/react`
- `/about`
- `/contact`

Also check the theme toggle, mobile navigation, CV download, cheatsheet copy buttons and demo interactions.
