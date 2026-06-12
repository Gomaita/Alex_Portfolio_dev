import { requireAdmin } from '../../../../../_utils/auth.js'
import { errorResponse, jsonResponse } from '../../../../../_utils/response.js'

export async function onRequestPatch(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { request, env, params } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await request.json().catch(() => null)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const now = new Date().toISOString()
  let result
  try {
    result = await env.DB.prepare(
      `UPDATE portfolio_3d_projects
       SET published = ?,
           published_at = CASE
             WHEN ? = 1 AND (published_at IS NULL OR published_at = '') THEN ?
             ELSE published_at
           END,
           updated_at = ?
       WHERE id = ?`,
    )
      .bind(data.published ? 1 : 0, data.published ? 1 : 0, now, now, params.id)
      .run()
  } catch (error) {
    const message = String(error?.message || '')
    if (message.includes('no such column') || message.includes('has no column')) {
      return errorResponse('D1 schema is missing published_at. Run the 3D R2 migration first.', 500)
    }
    return errorResponse('Could not update published state.', 500)
  }

  if (!result.meta?.changes) return errorResponse('3D project not found.', 404)

  return jsonResponse({ ok: true, message: 'Published state updated.' })
}
