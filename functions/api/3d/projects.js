import { errorResponse, jsonResponse } from '../../_utils/response.js'
import { map3DProject } from '../../_utils/threeDProjects.js'

export async function onRequestGet({ env }) {
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const result = await env.DB.prepare(
    `SELECT * FROM portfolio_3d_projects
     WHERE published = 1
     ORDER BY featured DESC, sort_order ASC, created_at DESC`,
  ).all()

  return jsonResponse({
    ok: true,
    projects: (result.results || []).map(map3DProject),
  })
}
