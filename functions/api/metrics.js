import { errorResponse, jsonResponse } from '../_utils/response.js'

async function countWhere(db, table, where = '1 = 1', bindings = []) {
  const result = await db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${where}`)
    .bind(...bindings)
    .first()

  return Number(result?.count || 0)
}

async function getLastCreatedAt(db, table) {
  const result = await db.prepare(
    `SELECT created_at
     FROM ${table}
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
  ).first()

  return result?.created_at || null
}

export async function onRequestGet(context) {
  const { env } = context

  if (!env.DB) {
    return errorResponse('Database binding is not configured.', 500)
  }

  try {
    const [
      totalContactMessages,
      newContactMessages,
      reviewedContactMessages,
      archivedContactMessages,
      totalProjectSubmissions,
      pendingProjectSubmissions,
      approvedProjectSubmissions,
      rejectedProjectSubmissions,
      publicProjects,
      privateProjects,
      lastContactCreatedAt,
      lastProjectSubmissionCreatedAt,
    ] = await Promise.all([
      countWhere(env.DB, 'contact_messages', 'deleted_at IS NULL'),
      countWhere(env.DB, 'contact_messages', 'status = ? AND deleted_at IS NULL', ['new']),
      countWhere(env.DB, 'contact_messages', 'status = ? AND deleted_at IS NULL', ['reviewed']),
      countWhere(env.DB, 'contact_messages', 'status = ? OR deleted_at IS NOT NULL', ['archived']),
      countWhere(env.DB, 'project_submissions', 'deleted_at IS NULL'),
      countWhere(env.DB, 'project_submissions', 'moderation_status = ? AND deleted_at IS NULL', ['pending']),
      countWhere(env.DB, 'project_submissions', 'moderation_status = ? AND deleted_at IS NULL', ['approved']),
      countWhere(env.DB, 'project_submissions', 'moderation_status = ? AND deleted_at IS NULL', ['rejected']),
      countWhere(env.DB, 'project_submissions', 'visibility = ? AND deleted_at IS NULL', ['public']),
      countWhere(env.DB, 'project_submissions', 'visibility = ? AND deleted_at IS NULL', ['private']),
      getLastCreatedAt(env.DB, 'contact_messages'),
      getLastCreatedAt(env.DB, 'project_submissions'),
    ])

    return jsonResponse({
      ok: true,
      updatedAt: new Date().toISOString(),
      databaseStatus: 'online',
      metrics: {
        totalContactMessages,
        newContactMessages,
        reviewedContactMessages,
        archivedContactMessages,
        totalProjectSubmissions,
        pendingProjectSubmissions,
        approvedProjectSubmissions,
        rejectedProjectSubmissions,
        publicProjects,
        privateProjects,
        lastContactCreatedAt,
        lastProjectSubmissionCreatedAt,
      },
    })
  } catch {
    return errorResponse('Database metrics are not available right now.', 500)
  }
}
