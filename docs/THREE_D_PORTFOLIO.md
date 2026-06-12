# 3D Portfolio

This project includes a hidden 3D portfolio section inside the same domain.

## Public Routes

- `/3d`
- `/3d/projects`
- `/3d/projects/:slug`

These routes are intentionally not linked from the main software portfolio, navbar, footer or sitemap.

## Admin Route

- `/3d/admin`

The admin route is private by obscurity plus backend token protection. It is not linked from the public 3D pages.

To unlock the panel, enter the backend `ADMIN_API_TOKEN`. The token is stored only in `sessionStorage` for the current browser session and is sent as:

```text
Authorization: Bearer <token>
```

## Creating Projects

Use `/3d/admin` to create, edit, publish, hide, feature or delete 3D projects.

Required field:

- Title

Optional fields include slug, subtitle, description, date, year, category, role, thumbnail URL, hero image URL, gallery images, tools, techniques, external links, breakdown and technical notes.

## Image Paths

This first version does not upload binary images.

Recommended structure:

```text
public/3d/projects/project-slug/thumbnail.jpg
public/3d/projects/project-slug/hero.jpg
public/3d/projects/project-slug/gallery-01.jpg
```

Then reference them in the admin panel:

```text
/3d/projects/project-slug/thumbnail.jpg
```

Gallery images support one item per line:

```text
/3d/projects/project-slug/gallery-01.jpg | Front view | Final render
```

External links support one item per line:

```text
ArtStation | https://example.com
Sketchfab | https://example.com
```

## Endpoints

Public:

- `GET /api/3d/projects`
- `GET /api/3d/projects/:slug`

Admin:

- `GET /api/admin/3d/projects`
- `POST /api/admin/3d/projects`
- `PATCH /api/admin/3d/projects/:id`
- `DELETE /api/admin/3d/projects/:id`
- `PATCH /api/admin/3d/projects/:id/publish`
- `PATCH /api/admin/3d/projects/:id/featured`

## D1 Table

The table is defined in `db/schema.sql` as:

```text
portfolio_3d_projects
```

JSON fields are stored as text columns and normalized by the API.

## Future Image Uploads

Real uploads should use dedicated storage such as Cloudflare R2. This version does not configure R2 and does not store base64 or binary images in D1.

## Security Notes

- Keep `ADMIN_API_TOKEN` only in Cloudflare backend environment variables/secrets.
- Do not expose admin tokens in frontend code.
- Public endpoints return only `published` projects.
- Admin endpoints require the existing bearer-token auth helper.
