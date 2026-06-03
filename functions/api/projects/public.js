import { errorResponse, jsonResponse } from '../../_utils/response.js'

export async function onRequestGet(context) {
  const { env } = context

  if (!env.DB) {
    return errorResponse('Database binding is not configured.', 500)
  }

  const result = await env.DB.prepare(
    `SELECT id, title, description, category, technologies, status, created_at, approved_at
     FROM project_submissions
     WHERE moderation_status = ? AND visibility = ? AND deleted_at IS NULL
     ORDER BY approved_at DESC, created_at DESC`,
  )
    .bind('approved', 'public')
    .all()

  return jsonResponse({ ok: true, projects: result.results || [] })
}
