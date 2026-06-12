# Hidden 3D Portfolio

This project includes a separate 3D portfolio inside the same domain. It is intentionally hidden from the main software portfolio.

## Routes

Public 3D routes:

- `/3d`
- `/3d/projects`
- `/3d/projects/:slug`

Private admin route:

- `/3d/admin`

The 3D section is not linked from the main software navbar, home page, footer, portfolio cards or sitemap. The direct entry point is `/3d`.

## Profile Direction

The 3D portfolio is focused on:

- 3D Environment & Prop Artist work
- real-time assets for games and VR
- PBR texturing
- Substance Painter workflows
- Substance Designer procedural materials
- retopology, UVs, baking and optimization
- engine-ready presentation

The tone should stay professional, visual and honest.

## Admin Access

Open `/3d/admin` directly. The panel asks for the existing backend `ADMIN_API_TOKEN`.

The token is:

- entered manually by the owner
- stored only in `sessionStorage`
- sent as `Authorization: Bearer <token>`
- never hardcoded in frontend code

## Creating A Project

Use `/3d/admin` to create, edit, duplicate, publish, hide, feature or delete projects.

Required:

- Title

Recommended:

- Slug
- Description
- Category
- Role
- Thumbnail URL
- Hero Image URL
- Gallery images
- Tools
- Techniques
- Engine
- Asset type
- Texture workflow
- Technical notes

Projects are drafts by default unless `Published` is enabled.

## Image Organization

This version does not upload binary images. Put images in `public/3d/projects/...` or use an external URL.

Recommended structure:

```text
public/3d/projects/project-slug/thumbnail.jpg
public/3d/projects/project-slug/hero.jpg
public/3d/projects/project-slug/final-01.jpg
public/3d/projects/project-slug/wireframe-01.jpg
public/3d/projects/project-slug/textures-basecolor.jpg
```

Public paths used in the admin:

```text
/3d/projects/project-slug/thumbnail.jpg
/3d/projects/project-slug/hero.jpg
/3d/projects/project-slug/final-01.jpg
```

## Gallery Images

Gallery images use one item per line:

```text
URL | Alt text | Caption | Section
```

Example:

```text
/3d/projects/forest-shrine/final-01.jpg | Forest shrine final render | Final lighting pass | Final renders
/3d/projects/forest-shrine/wireframe-01.jpg | Forest shrine wireframe | Low poly wireframe | Wireframe
```

Sections are displayed on the project detail page when present.

## Texture Maps

Texture maps use one item per line:

```text
Label | URL | Note
```

Example:

```text
Base Color | /3d/projects/forest-shrine/textures-basecolor.jpg | 2K PBR base color
Normal | /3d/projects/forest-shrine/textures-normal.jpg | Baked high poly detail
Roughness | /3d/projects/forest-shrine/textures-roughness.jpg | Painter roughness pass
```

Texture map images are displayed in their own section and can be opened in the project lightbox.

## Content Blocks

Content blocks allow a project page to behave more like a flexible ArtStation-style post.

Each line follows:

```text
type | title | text | data
```

Supported first-version block types:

- `text`
- `note`
- `specs`
- `technicalBreakdown`
- `imageGrid`

Examples:

```text
text | Lighting pass | I used a cool key light and warm fill to separate the prop from the background.
specs | Asset specs | | Tris: 18k; Textures: 2K; Target: Real-time
technicalBreakdown | Optimization | | LODs: Planned; UV Sets: 1; Baking: High to low
imageGrid | Wireframe | Low poly mesh and topology checks | /3d/projects/crate/wireframe.jpg, Wireframe view
```

If a project has no content blocks, the classic description, gallery, breakdown and technical notes still render normally.

## D1 Table

The table is defined in `db/schema.sql`:

```text
portfolio_3d_projects
```

New technical fields include:

- `engine`
- `asset_type`
- `polycount`
- `texture_resolution`
- `texel_density`
- `target_platform`
- `time_spent`
- `software_used_json`
- `materials_json`
- `shader_notes`
- `optimization_notes`
- `texture_workflow`
- `substance_painter_notes`
- `substance_designer_notes`
- `texture_maps_json`
- `content_blocks_json`

JSON fields are stored as text and parsed safely by the API.

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

Public endpoints only return published projects. Admin endpoints require the bearer token.

## Storage Notes

This version does not use Cloudflare R2 yet.

Do not store:

- binary images in D1
- base64 images in D1
- private files in public folders

A future R2 version could add authenticated uploads, image metadata, signed admin upload URLs and image deletion workflows.

## Security Notes

- Keep `ADMIN_API_TOKEN` only in Cloudflare backend environment variables/secrets.
- Do not expose admin tokens in frontend code.
- The admin route is intentionally not linked anywhere publicly.
- Draft projects are not returned by public endpoints.
- The 3D portfolio remains separate from the main software portfolio.
