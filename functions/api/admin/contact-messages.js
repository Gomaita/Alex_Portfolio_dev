import { createAuditLog } from '../../_utils/audit.js'
import { requireAdmin } from '../../_utils/auth.js'
import { errorResponse, jsonResponse } from '../../_utils/response.js'
import { sanitizeText } from '../../_utils/sanitize.js'

const allowedStatuses = new Set(['new', 'reviewed', 'archived'])
const patchStatuses = new Set(['reviewed', 'archived'])

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
    return errorResponse('Unsupported contact message status.', 400)
  }

  const query = status
    ? `SELECT * FROM contact_messages
       WHERE status = ? AND deleted_at IS NULL
       ORDER BY created_at DESC`
    : `SELECT * FROM contact_messages
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC`
  const statement = env.DB.prepare(query)
  const result = status ? await statement.bind(status).all() : await statement.all()

  return jsonResponse({ ok: true, messages: result.results || [] })
}

export async function onRequestPatch(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response

  const { request, env } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await readJson(request)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const id = getIdFromRequest(request, data)
  const status = sanitizeText(data.status, 40)
  const now = new Date().toISOString()

  if (!id) return errorResponse('Message id is required.', 400)
  if (!patchStatuses.has(status)) return errorResponse('Unsupported status update.', 400)

  const result = await env.DB.prepare(
    `UPDATE contact_messages
     SET status = ?, reviewed_at = CASE WHEN ? = 'reviewed' THEN ? ELSE reviewed_at END
     WHERE id = ? AND deleted_at IS NULL`,
  )
    .bind(status, status, now, id)
    .run()

  if (!result.meta?.changes) return errorResponse('Message not found.', 404)

  await createAuditLog(env, {
    action: `contact_${status}`,
    targetType: 'contact_message',
    targetId: id,
    actor: auth.actor,
  })

  return jsonResponse({ ok: true, message: 'Contact message updated.' })
}

export async function onRequestDelete(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response

  const { request, env } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await readJson(request)
  const id = getIdFromRequest(request, data || {})

  if (!id) return errorResponse('Message id is required.', 400)

  const result = await env.DB.prepare(
    `UPDATE contact_messages
     SET status = ?, deleted_at = ?
     WHERE id = ? AND deleted_at IS NULL`,
  )
    .bind('archived', new Date().toISOString(), id)
    .run()

  if (!result.meta?.changes) return errorResponse('Message not found.', 404)

  await createAuditLog(env, {
    action: 'contact_delete',
    targetType: 'contact_message',
    targetId: id,
    actor: auth.actor,
  })

  return jsonResponse({ ok: true, message: 'Contact message archived.' })
}
