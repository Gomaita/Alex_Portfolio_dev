# Hidden 3D Portfolio

This project includes a separate 3D portfolio inside the same domain. It is intentionally hidden from the main software portfolio.

## Routes

Public:

- `/3d`
- `/3d/projects`
- `/3d/projects/:slug`

Private:

- `/3d/admin`

The 3D section is not linked from the main software navbar, home page, footer, portfolio cards or sitemap. The direct entry point is `/3d`.

## Storage Model

D1 stores project data and media metadata only.

R2 stores images and media files.

No base64 images or binary blobs should be stored in D1.

## Cloudflare Bindings

Required:

- `DB`: D1 database binding
- `MEDIA_BUCKET`: R2 bucket binding for `alex-portfolio-media`
- `ADMIN_API_TOKEN`: backend admin token

Optional:

- `MEDIA_PUBLIC_BASE_URL=https://media.alexgl.dev`

If `MEDIA_PUBLIC_BASE_URL` is not configured, the backend falls back to `https://media.alexgl.dev`.

## R2 Structure

Uploads are created automatically from the admin panel. You do not need to create folders manually.

Generated keys follow:

```text
3d/projects/{slug}/thumbnail/{file}
3d/projects/{slug}/hero/{file}
3d/projects/{slug}/media/{file}
3d/projects/{slug}/final/{file}
3d/projects/{slug}/closeups/{file}
3d/projects/{slug}/breakdown/{file}
3d/projects/{slug}/textures/{file}
3d/projects/{slug}/uv/{file}
3d/projects/{slug}/wireframe/{file}
3d/projects/{slug}/material/{file}
3d/projects/{slug}/engine/{file}
3d/projects/{slug}/other/{file}
```

Public URL example:

```text
https://media.alexgl.dev/3d/projects/medieval-barrel-prop/textures/base-color.webp
```

## Admin Workflow

Open `/3d/admin` directly and enter `ADMIN_API_TOKEN`.

Recommended flow:

1. Create new artwork.
2. Add title and description.
3. Upload a project thumbnail.
4. Add media blocks: image, image grid, text or technical note.
5. Select categories.
6. Select software used.
7. Add tags.
8. Save draft.
9. Preview.
10. Publish.

The token is stored only in `sessionStorage` and sent as:

```text
Authorization: Bearer <token>
```

## Media Uploads

Admin upload endpoint:

- `POST /api/admin/3d/uploads`

FormData fields:

- `file`
- `projectSlug`
- `mediaType`

Accepted image types:

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/avif`

Upload limit:

- 15 MB per file

Recommended for performance:

- WebP/JPG
- under 5 MB for gallery images
- around 1200x900 and under 1 MB for thumbnails

Delete endpoint:

- `DELETE /api/admin/3d/uploads`

Payload:

```json
{
  "key": "3d/projects/project-slug/media/file.webp"
}
```

or:

```json
{
  "url": "https://media.alexgl.dev/3d/projects/project-slug/media/file.webp"
}
```

Deletes are restricted to keys starting with `3d/projects/`.

## Content Blocks

Project pages are built from `content_blocks_json`.

Supported blocks:

- `image`
- `imageGrid`
- `text`
- `technicalNote`

Each block can store:

- `type`
- `title`
- `text`
- `category`
- `images`

Images store:

- `url`
- `key`
- `alt`
- `caption`

D1 stores only these URLs and metadata. R2 stores the actual image files.

## Categories, Software And Tags

Categories are stored in:

```text
categories_json
```

Software used is stored in:

```text
software_used_json
```

Tags are stored in:

```text
tags_json
```

The legacy `category` and `tools_json` fields are still maintained for compatibility with older project cards and fallbacks.

## D1 Schema

The table is defined in `db/schema.sql`:

```text
portfolio_3d_projects
```

Important media/editor fields:

- `thumbnail_url`
- `hero_image_url`
- `content_blocks_json`
- `software_used_json`
- `categories_json`
- `tags_json`
- `published`
- `featured`
- `published_at`

Technical fields kept for advanced details:

- `engine`
- `asset_type`
- `polycount`
- `texture_resolution`
- `texel_density`
- `target_platform`
- `time_spent`
- `materials_json`
- `shader_notes`
- `optimization_notes`
- `texture_workflow`
- `substance_painter_notes`
- `substance_designer_notes`
- `texture_maps_json`

## D1 Migration

If the table already exists, run only the missing statements from:

```text
db/migrations/3d_portfolio_r2_uploads.sql
```

Current migration:

```sql
ALTER TABLE portfolio_3d_projects ADD COLUMN categories_json TEXT;
ALTER TABLE portfolio_3d_projects ADD COLUMN tags_json TEXT;
ALTER TABLE portfolio_3d_projects ADD COLUMN published_at TEXT;
```

Cloudflare D1/SQLite may fail if a column already exists, so run only the statements for columns that are missing.

## Project Endpoints

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
- `POST /api/admin/3d/uploads`
- `DELETE /api/admin/3d/uploads`

Public project endpoints only return published projects. Admin endpoints require the bearer token.

## Future R2 Improvements

Possible next steps:

- image replacement with automatic old-object deletion
- R2 asset browser
- generated thumbnails
- image size metadata
- signed upload URLs
- bulk media cleanup for deleted projects
