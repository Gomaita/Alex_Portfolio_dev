# Deploy Checklist

## Before Deploying

- Run `npm install`.
- Run `npm run dev`.
- Run `npm run build`.
- Review all routes.
- Review internal links.
- Review external links.
- Review responsive layouts.
- Review environment variables.
- Review README.
- Confirm there are no API keys or private tokens in the code.
- Confirm `public/Alex_Gomez_CV.pdf` exists.

## Vercel

- Push the project to GitHub.
- Import the repository in Vercel.
- Select Vite as the framework.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add environment variables if needed.

## Netlify

- Push the project to GitHub.
- Import the repository in Netlify.
- Build command: `npm run build`.
- Publish directory: `dist`.
- Add environment variables if needed.

## Post-Deploy

- Test Home.
- Test Portfolio.
- Test project detail pages.
- Test Cheatsheets.
- Test cheatsheet detail pages.
- Test APIs and fallback states.
- Test Project Manager localStorage behavior.
- Test mobile navigation.
- Test external links.
- Test CV download.
- Test 404 page.
