import { createId } from './ids.js'

export async function createAuditLog(env, { action, targetType, targetId, actor, metadata = {} }) {
  if (!env.DB) return

  await env.DB.prepare(
    `INSERT INTO audit_logs (id, action, target_type, target_id, actor, created_at, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      createId('audit'),
      action,
      targetType,
      targetId,
      actor,
      new Date().toISOString(),
      JSON.stringify(metadata),
    )
    .run()
}
