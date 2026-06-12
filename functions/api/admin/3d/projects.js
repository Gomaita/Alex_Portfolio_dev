import { requireAdmin } from '../../../_utils/auth.js'
import { createId } from '../../../_utils/ids.js'
import { errorResponse, jsonResponse } from '../../../_utils/response.js'
import { bind3DProjectValues, map3DProject, validate3DProjectPayload } from '../../../_utils/threeDProjects.js'

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export async function onRequestGet(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { env } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const result = await env.DB.prepare(
    `SELECT * FROM portfolio_3d_projects
     ORDER BY featured DESC, sort_order ASC, created_at DESC`,
  ).all()

  return jsonResponse({ ok: true, projects: (result.results || []).map(map3DProject) })
}

export async function onRequestPost(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { request, env } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await readJson(request)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const validation = validate3DProjectPayload(data)
  if (!validation.ok) return errorResponse(validation.message, 400)

  const now = new Date().toISOString()
  const id = createId('3d_project')
  const project = validation.value
  if (project.published && !project.publishedAt) project.publishedAt = now

  try {
    await env.DB.prepare(
      `INSERT INTO portfolio_3d_projects (
        id, slug, title, subtitle, description, date, year, category, role,
        thumbnail_url, hero_image_url, images_json, tools_json, techniques_json,
        external_links_json, breakdown, technical_notes, engine, asset_type,
        polycount, texture_resolution, texel_density, target_platform, time_spent,
        software_used_json, categories_json, tags_json, materials_json,
        shader_notes, optimization_notes, texture_workflow, substance_painter_notes,
        substance_designer_notes, texture_maps_json, content_blocks_json,
        published, featured, sort_order, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(id, ...bind3DProjectValues(project), now, now)
      .run()
  } catch (error) {
    const message = String(error?.message || '')
    if (message.includes('no such column') || message.includes('has no column')) {
      return errorResponse('D1 schema is missing 3D portfolio columns. Run the 3D R2 migration first.', 500)
    }
    return errorResponse('A project with this slug already exists.', 409)
  }

  return jsonResponse({ ok: true, message: '3D project created.', id }, 201)
}
