import { requireAdmin } from '../../../../../_utils/auth.js'
import { errorResponse, jsonResponse } from '../../../../../_utils/response.js'

export async function onRequestPatch(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { request, env, params } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await request.json().catch(() => null)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const result = await env.DB.prepare(
    'UPDATE portfolio_3d_projects SET published = ?, updated_at = ? WHERE id = ?',
  )
    .bind(data.published ? 1 : 0, new Date().toISOString(), params.id)
    .run()

  if (!result.meta?.changes) return errorResponse('3D project not found.', 404)

  return jsonResponse({ ok: true, message: 'Published state updated.' })
}
