# Deploy Checklist

## Before Deploying

- Run `npm install` if dependencies are not installed yet.
- Run `npm run dev` and review the main routes locally.
- Run `npm run build`.
- Review responsive layouts.
- Review light and dark mode.
- Review internal and external links.
- Confirm there are no API keys or private tokens in the code.
- Confirm `public/Alex_Gomez_CV_ATS.pdf` exists.
- Confirm `public/Alex_Gomez_CV_Visual.pdf` exists.
- Confirm README and docs use `https://alexgl.dev`.

## Cloudflare Pages

- Push the project to GitHub.
- Let Cloudflare Pages deploy from the connected repository.
- Build command: `npm run build`.
- Output directory: `dist`.
- Functions directory: `functions/`.
- Custom domain: `https://alexgl.dev`.

Backend configuration in Cloudflare:

- D1 binding: `DB`.
- `ADMIN_API_TOKEN`.
- `RESEND_API_KEY`.
- `CONTACT_NOTIFICATION_EMAIL`.
- `CONTACT_EMAIL_FROM`.
- `VITE_BACKEND_ENABLED=true`.

## Post-Deploy

- Test Home.
- Test Portfolio.
- Test project detail pages.
- Test Cheatsheets.
- Test About and Contact.
- Test `/api/health`.
- Test `/api/metrics`.
- Test Weather Search App.
- Test Market API Dashboard.
- Test Contact form storage and email notification.
- Test ATS CV and Visual CV downloads.
- Test mobile navigation.
- Test 404 page.
