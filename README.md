# Alex Gomez Portfolio

Personal portfolio built to present my work as a junior software developer with a background in Multimedia Engineering, 3D and VR.

The goal of this project is simple: show what I am learning, keep the code readable, and document small practical demos that connect frontend, data, UI and backend-ready ideas.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Cloudflare-ready structure with Functions, D1-style schema and environment examples

## Features

- Responsive portfolio layout
- Light and dark mode
- Project pages with demo-focused explanations
- Educational frontend demos
- Programming cheatsheets
- CV download options
- Contact page prepared for a future backend
- Documentation for backend and deployment preparation

## Educational Demos

This portfolio includes small demos built for practice and learning. They are designed to show frontend logic, state management, data handling and UI decisions in a clear way.

Some demos are fully frontend-based. Others are prepared to connect with a backend later, but they are still safe to run as portfolio examples.

## Backend-Ready Structure

The project includes a backend-ready structure with:

- `functions/` for Cloudflare Pages Functions
- `db/` for database schema files
- `docs/` for backend, security and deployment notes
- `src/services/` for API and backend service helpers
- `.env.example` as a safe reference for local environment variables

No production secrets are included in the repository.

## Cloudflare-Ready Deployment

The project is prepared to be deployed with Cloudflare Pages. The frontend can be built with Vite, and the backend folder structure is ready for future Cloudflare Functions usage.

For a normal static deployment, the build output is generated in:

```bash
dist
```

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

## Environment Variables

Use `.env.example` as a reference and create a local `.env` file only when needed.

Do not commit real tokens, API keys, passwords or production secrets.

Example variables may include:

```bash
VITE_API_BASE_URL=
VITE_ENABLE_BACKEND=false
ADMIN_API_TOKEN=
```

Values in `.env.example` should stay empty or clearly fake.

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

public/
  Alex_Gomez_CV_ATS.pdf
  Alex_Gomez_CV_Visual.pdf

docs/
db/
functions/
```

## About

I built this project as a junior developer portfolio: something practical, personal and easy to explain. It is a place to collect what I am learning and keep improving it step by step.
