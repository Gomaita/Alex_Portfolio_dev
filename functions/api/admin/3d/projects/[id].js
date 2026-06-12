import { requireAdmin } from '../../../../_utils/auth.js'
import { errorResponse, jsonResponse } from '../../../../_utils/response.js'
import { bind3DProjectValues, validate3DProjectPayload } from '../../../../_utils/threeDProjects.js'

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export async function onRequestPatch(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { request, env, params } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await readJson(request)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const validation = validate3DProjectPayload(data)
  if (!validation.ok) return errorResponse(validation.message, 400)

  const now = new Date().toISOString()
  const project = validation.value

  try {
    const result = await env.DB.prepare(
      `UPDATE portfolio_3d_projects
       SET slug = ?, title = ?, subtitle = ?, description = ?, date = ?, year = ?,
           category = ?, role = ?, thumbnail_url = ?, hero_image_url = ?,
           images_json = ?, tools_json = ?, techniques_json = ?, external_links_json = ?,
           breakdown = ?, technical_notes = ?, engine = ?, asset_type = ?,
           polycount = ?, texture_resolution = ?, texel_density = ?,
           target_platform = ?, time_spent = ?, software_used_json = ?,
           materials_json = ?, shader_notes = ?, optimization_notes = ?,
           texture_workflow = ?, substance_painter_notes = ?,
           substance_designer_notes = ?, texture_maps_json = ?,
           content_blocks_json = ?, published = ?, featured = ?,
           sort_order = ?, updated_at = ?
       WHERE id = ?`,
    )
      .bind(...bind3DProjectValues(project), now, params.id)
      .run()

    if (!result.meta?.changes) return errorResponse('3D project not found.', 404)
  } catch {
    return errorResponse('A project with this slug already exists.', 409)
  }

  return jsonResponse({ ok: true, message: '3D project updated.' })
}

export async function onRequestDelete(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { env, params } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const result = await env.DB.prepare('DELETE FROM portfolio_3d_projects WHERE id = ?')
    .bind(params.id)
    .run()

  if (!result.meta?.changes) return errorResponse('3D project not found.', 404)

  return jsonResponse({ ok: true, message: '3D project deleted.' })
}
