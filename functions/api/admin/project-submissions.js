import { createAuditLog } from '../../_utils/audit.js'
import { requireAdmin } from '../../_utils/auth.js'
import { errorResponse, jsonResponse } from '../../_utils/response.js'
import { sanitizeText } from '../../_utils/sanitize.js'

const allowedStatuses = new Set(['pending', 'approved', 'rejected'])
const allowedActions = new Set(['approve', 'reject', 'make_private', 'make_public'])

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function getIdFromRequest(request, data) {
  const url = new URL(request.url)
  return data?.id || url.searchParams.get('id')
}

export async function onRequestGet(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response

  const { request, env } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const url = new URL(request.url)
  const status = url.searchParams.get('status')

  if (status && !allowedStatuses.has(status)) {
    return errorResponse('Unsupported moderation status.', 400)
  }

  const query = status
    ? `SELECT * FROM project_submissions
       WHERE moderation_status = ? AND deleted_at IS NULL
       ORDER BY created_at DESC`
    : `SELECT * FROM project_submissions
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC`
  const statement = env.DB.prepare(query)
  const result = status ? await statement.bind(status).all() : await statement.all()

  return jsonResponse({ ok: true, submissions: result.results || [] })
}

export async function onRequestPatch(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response

  const { request, env } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await readJson(request)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const id = getIdFromRequest(request, data)
  const action = sanitizeText(data.action, 40)
  const adminNotes = sanitizeText(data.adminNotes || '', 1000)
  const now = new Date().toISOString()

  if (!id) return errorResponse('Submission id is required.', 400)
  if (!allowedActions.has(action)) return errorResponse('Unsupported action.', 400)

  if (action === 'make_public') {
    const current = await env.DB.prepare(
      'SELECT moderation_status FROM project_submissions WHERE id = ? AND deleted_at IS NULL',
    )
      .bind(id)
      .first()

    if (!current) return errorResponse('Submission not found.', 404)
    if (current.moderation_status !== 'approved') {
      return errorResponse('Only approved submissions can be made public.', 400)
    }
  }

  const updates = {
    approve: {
      sql: `UPDATE project_submissions
            SET moderation_status = ?, visibility = ?, approved_at = ?, updated_at = ?
            WHERE id = ? AND deleted_at IS NULL`,
      values: ['approved', 'public', now, now, id],
    },
    reject: {
      sql: `UPDATE project_submissions
            SET moderation_status = ?, visibility = ?, rejected_at = ?, admin_notes = ?, updated_at = ?
            WHERE id = ? AND deleted_at IS NULL`,
      values: ['rejected', 'private', now, adminNotes || 'Rejected by admin.', now, id],
    },
    make_private: {
      sql: `UPDATE project_submissions
            SET visibility = ?, updated_at = ?
            WHERE id = ? AND deleted_at IS NULL`,
      values: ['private', now, id],
    },
    make_public: {
      sql: `UPDATE project_submissions
            SET visibility = ?, updated_at = ?
            WHERE id = ? AND deleted_at IS NULL`,
      values: ['public', now, id],
    },
  }

  const update = updates[action]
  const result = await env.DB.prepare(update.sql).bind(...update.values).run()

  if (!result.meta?.changes) return errorResponse('Submission not found.', 404)

  await createAuditLog(env, {
    action,
    targetType: 'project_submission',
    targetId: id,
    actor: auth.actor,
    metadata: { adminNotes: adminNotes || null },
  })

  return jsonResponse({ ok: true, message: 'Submission updated.' })
}

export async function onRequestDelete(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response

  const { request, env } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await readJson(request)
  const id = getIdFromRequest(request, data || {})
  const now = new Date().toISOString()

  if (!id) return errorResponse('Submission id is required.', 400)

  const result = await env.DB.prepare(
    `UPDATE project_submissions
     SET deleted_at = ?, visibility = ?, updated_at = ?
     WHERE id = ? AND deleted_at IS NULL`,
  )
    .bind(now, 'private', now, id)
    .run()

  if (!result.meta?.changes) return errorResponse('Submission not found.', 404)

  await createAuditLog(env, {
    action: 'delete',
    targetType: 'project_submission',
    targetId: id,
    actor: auth.actor,
  })

  return jsonResponse({ ok: true, message: 'Submission deleted.' })
}
