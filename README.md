# Alex Gomez Portfolio

Live site: https://alexgl.dev


## Purpose

This portfolio is not just a static page. I use it as a place to keep learning and to show how I work with React, APIs, forms, SQL concepts, Cloudflare D1, localStorage and clear UI states.

I am still improving it, but I wanted it to feel honest: simple where it should be simple, and detailed enough to explain the thinking behind each demo.

Security Lab and Blockchain Lab are larger learning projects with their own interface and simulated workflows.

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

