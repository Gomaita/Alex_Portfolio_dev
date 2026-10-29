# Soft Organic Editorial — local design studio

Branch: `codex/portfolio-v2-organic-editorial`.

## Open the previews

From the repository root:

```sh
npm run dev -- --host 127.0.0.1 --port 4180 --strictPort
```

- A / Editorial Air: http://127.0.0.1:4180/preview/organic/a
- B / Fluid Sculpture: http://127.0.0.1:4180/preview/organic/b
- C / Balanced Organic (initial candidate): http://127.0.0.1:4180/preview/organic/c

The top selector preserves the current page while switching variants. Each variant has Home, `/projects`, `/projects/:slug`, `/about` and `/contact`. The default `/preview/organic` redirects to C. Unknown project slugs show a local not-found page.

This is intentionally a local-only studio. The route and lazy import are guarded by `import.meta.env.DEV`; a normal production build excludes the entire studio, its CSS and its imported screenshots. `npm run preview` serves the production build, so it cannot display these designs. Use the dev command above.

The server binds to loopback. No branch was pushed or deployed, no Cloudflare configuration was changed, and no public navigation/sitemap entry was added. A future internet preview needs an authenticated Cloudflare Access setup **before** enabling these routes in a branch deployment. `noindex` and hidden URLs are not authentication. No hosted/private preview has been provisioned or claimed.

## Implemented

- Shared architecture for three deliberately different compositions: A is white and restrained with a tall ellipse; B has a tilted organic portrait, overlapping volumes and softer masks; C balances typography, portrait and three glass objects.
- Porcelain/white/silver palette, a subdued sage accent, system sans-serif and locally available editorial serif fallbacks. No remote font requests.
- Floating capsule navigation, keyboard skip link, active navigation, local variant switcher and visible focus.
- Home, filtered project gallery, four complete project presentations, About with verified education/CV, and Contact with existing email/social links and service integration.
- Real local screenshots of DevPulse AI, NutriCore, InboxFlow AI and SQL Query Playground. Descriptions distinguish curated sample data, local demos, configured AI and pending backend infrastructure. No fabricated applications or screenshots.
- Independent original application links: `/devpulse`, `/nutricore`, `/ai-message-processor`, `/portfolio/sql-query-playground`. Original application interfaces are not reconstructed.
- Lightweight entry animation, finite ambient movement, optional CSS scroll-driven reveal/parallax where supported, and full reduced-motion fallback including anchor scrolling.
- Per-route title updates, `noindex, nofollow`, description and theme-color; previous head values and scroll preference are restored on leaving the studio.

## Architecture and customization

All new UI lives in `src/features/portfolio-organic/`:

| File                 | Responsibility                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `OrganicPreview.jsx` | Local router, metadata lifecycle, navigation, variant selector and footer                              |
| `components.jsx`     | EditorialHeading, OrganicButton, OvalPortrait, OrganicArt, OrganicHero, ProjectGallery, ContactSection |
| `pages.jsx`          | Home, Projects, Project Detail, About, Contact and not-found views                                     |
| `ContactForm.jsx`    | V2 presentation using the existing contact service                                                     |
| `data.js`            | One source of content, projects, image configuration and variants                                      |
| `Organic.module.css` | Scoped CSS, design tokens, composition variants and breakpoints                                        |
| `assets/`            | Actual application screenshots, imported only by the local studio                                      |
| `verify.mjs`         | Repeatable browser, accessibility, navigation and responsive checks                                    |

The only existing source file changed is `src/App.jsx`, adding the development-only route boundary. Existing Home, `/newindex`, 3D, DevPulse, global styles, backend, bindings, storage and production routing remain untouched. Existing uncommitted edits in the DevPulse progress/decisions documents remain separate.

### Replace the portraits

No standalone personal photographs were found in the inspected assets. Neutral monogram compositions explicitly reserve the portrait position. They are not synthetic people or final photography.

1. Add optimized personal photos to this feature's `assets/` directory, preferably WebP/AVIF with a sensible JPEG alternative if needed. A 1000–1400 px portrait is sufficient for these layouts.
2. Import the image in `data.js`, for example `import heroPortrait from './assets/alex-hero.webp'`.
3. Set `portraits.hero.src = heroPortrait` in the exported object, and write the appropriate `alt` text.
4. Adjust `position`, e.g. `'50% 35%'`, to place the face correctly. Repeat independently for `about` and optional `contact`.

`OvalPortrait` preserves the image's aspect ratio using `object-fit: cover`. The oval clips the image without stretching it. Hero loads eagerly; secondary photos load lazily. All three variants use the same image config, so a single replacement updates them together.

Edit CSS custom properties at `.studio` for palette/type and the `[data-variant]` rules for art direction. Project screenshots, copy, capabilities, source links and categories live in `data.js`. No page duplication is needed.

### Contact behavior

The V2 form calls the existing `createContactMessage` service with the existing payload and honeypot. It retains real pending, success and failure states. It does not add an endpoint or duplicate backend logic. When `appConfig.isBackendEnabled` is false, sending is disabled and the email link remains available. The local UI does not claim successful delivery. No test sends an email or writes production data.

## Validation

```sh
npm run build
npm run test:devpulse
npm run test:devpulse:e2e
npm run typecheck:devpulse
npm run devpulse:fixture:check
npx --no-install eslint src/features/portfolio-organic src/App.jsx
node src/features/portfolio-organic/verify.mjs
git diff --check
```

Start the local server on port 4180 before running `verify.mjs`. It visits five page types in all three variants at 1440, 1024, 768, 390 and 375 px, checks horizontal overflow, images, metadata, filters, switching, keyboard, reduced motion and representative WCAG A/AA rules. It saves desktop/mobile screenshots to ignored `test-results/organic/`. Browser API responses in the existing DevPulse suite remain test doubles.

The repository-wide `npm run lint` still reports the pre-existing 39 errors and 3 warnings; unrelated components and services were not rewritten to hide them. The production build retains the known large-entry-chunk warning. Real email delivery, private DevPulse infrastructure and hosted preview authentication are not validated by this design work.

## Next decision

### Delivery checks executed

- Production build: PASS; development-only studio code and imported captures absent from output.
- Organic browser suite: PASS, 75 page/viewport combinations and interaction/metadata/keyboard checks; representative axe WCAG checks report no violations.
- Existing frontend unit suite: 22/22 PASS.
- Existing DevPulse/legacy browser suite: 11/11 PASS.
- DevPulse TypeScript and snapshot consistency: PASS.
- Targeted ESLint for the new feature and App: PASS.
- Production-browser smoke: 10 original routes mounted, including `/newindex`, 3D admin, AI applications and DevPulse; the organic route is unavailable in that build.
- `git diff --check`: PASS. Full repository lint retains 39 pre-existing errors and 3 warnings.
- Desktop/mobile captures saved for each variant's five page types; selected Home, gallery, About and Contact captures visually reviewed. No dependencies installed or changed.

### Next phase

Choose A, B or C after reviewing the local pages and supplying personal photographs. Then refine typography, portrait crops and composition on that choice. A protected branch deployment and eventual Home activation are separate future actions; neither is part of this delivery.
