import { createId } from '../_utils/ids.js'
import { errorResponse, jsonResponse } from '../_utils/response.js'
import { validateContactMessage } from '../_utils/validation.js'

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export async function onRequestPost(context) {
  const { request, env } = context

  if (!env.DB) {
    return errorResponse('Database binding is not configured.', 500)
  }

  const data = await readJson(request)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  if (data.honeypot) {
    return jsonResponse({ ok: true, message: 'Message received.' })
  }

  const validation = validateContactMessage(data)
  if (!validation.ok) {
    return errorResponse('Contact message validation failed.', 400, validation.errors)
  }

  const now = new Date().toISOString()

  await env.DB.prepare(
    `INSERT INTO contact_messages (id, name, email, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      createId('msg'),
      validation.value.name,
      validation.value.email,
      validation.value.message,
      'new',
      now,
    )
    .run()

  return jsonResponse({ ok: true, message: 'Message received.' })
}
