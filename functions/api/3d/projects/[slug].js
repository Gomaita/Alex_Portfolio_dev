import { errorResponse, jsonResponse } from '../../../_utils/response.js'
import { map3DProject } from '../../../_utils/threeDProjects.js'

export async function onRequestGet({ env, params }) {
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  let project
  try {
    project = await env.DB.prepare(
      `SELECT * FROM portfolio_3d_projects
       WHERE slug = ? AND published = 1`,
    )
      .bind(params.slug)
      .first()
  } catch {
    return errorResponse('3D project is not available right now.', 500)
  }

  if (!project) return errorResponse('3D project not found.', 404)

  return jsonResponse({ ok: true, project: map3DProject(project) })
}
