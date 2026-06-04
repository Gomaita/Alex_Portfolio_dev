import { createId } from '../_utils/ids.js'
import { sendContactNotification } from '../_utils/email.js'
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
  const id = createId('msg')
  const savedMessage = {
    id,
    name: validation.value.name,
    email: validation.value.email,
    message: validation.value.message,
    created_at: now,
  }

  await env.DB.prepare(
    `INSERT INTO contact_messages (id, name, email, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      savedMessage.id,
      savedMessage.name,
      savedMessage.email,
      savedMessage.message,
      'new',
      savedMessage.created_at,
    )
    .run()

  try {
    const emailResult = await sendContactNotification(env, savedMessage)

    if (!emailResult.ok && !emailResult.skipped) {
      console.warn('Contact notification email failed', {
        messageId: savedMessage.id,
        status: emailResult.status,
        message: emailResult.message,
      })
    }
  } catch (error) {
    console.warn('Contact notification email failed', {
      messageId: savedMessage.id,
      message: error?.message || 'Unknown email error.',
    })
  }

  return jsonResponse({ ok: true, message: 'Message received.' })
}
