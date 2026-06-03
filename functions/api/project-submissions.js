import { createId } from '../_utils/ids.js'
import { errorResponse, jsonResponse } from '../_utils/response.js'
import { validateProjectSubmission } from '../_utils/validation.js'

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
    return jsonResponse({
      ok: true,
      message: 'Project submission received and waiting for review.',
    })
  }

  const validation = validateProjectSubmission(data)
  if (!validation.ok) {
    return errorResponse('Project submission validation failed.', 400, validation.errors)
  }

  const now = new Date().toISOString()

  await env.DB.prepare(
    `INSERT INTO project_submissions (
      id, title, description, submitter_name, submitter_email, category,
      technologies, status, visibility, moderation_status, admin_notes,
      created_at, updated_at, approved_at, rejected_at, deleted_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      createId('proj'),
      validation.value.title,
      validation.value.description,
      validation.value.submitterName,
      validation.value.submitterEmail,
      validation.value.category,
      validation.value.technologies,
      'pending',
      'private',
      'pending',
      null,
      now,
      now,
      null,
      null,
      null,
    )
    .run()

  return jsonResponse({
    ok: true,
    message: 'Project submission received and waiting for review.',
  })
}
