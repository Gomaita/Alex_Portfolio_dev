import { errorResponse, jsonResponse } from '../_utils/response.js'

async function checkService(id, name, description, check) {
  const startedAt = Date.now()
  const lastChecked = new Date().toISOString()

  try {
    await check()
    return {
      id,
      name,
      status: 'online',
      responseTimeMs: Date.now() - startedAt,
      description,
      lastChecked,
    }
  } catch {
    return {
      id,
      name,
      status: 'offline',
      responseTimeMs: Date.now() - startedAt,
      description: `${name} check failed.`,
      lastChecked,
    }
  }
}

function summarizeServices(services) {
  const totalServices = services.length
  const online = services.filter((service) => service.status === 'online').length
  const degraded = services.filter((service) => service.status === 'degraded').length
  const offline = services.filter((service) => service.status === 'offline').length
  const averageResponseTimeMs =
    totalServices === 0
      ? 0
      : Math.round(
          services.reduce((total, service) => total + service.responseTimeMs, 0) / totalServices,
        )

  return { totalServices, online, degraded, offline, averageResponseTimeMs }
}

export async function onRequestGet(context) {
  const { env } = context
  const checkedAt = new Date().toISOString()

  if (!env.DB) {
    return errorResponse('Database binding is not configured.', 500)
  }

  const services = await Promise.all([
    checkService('d1', 'D1 Database', 'Database binding is available.', async () => {
      await env.DB.prepare('SELECT 1').first()
    }),
    checkService('contact-messages', 'Contact Messages', 'contact_messages table is reachable.', async () => {
      await env.DB.prepare('SELECT COUNT(*) AS count FROM contact_messages').first()
    }),
    checkService('project-submissions', 'Project Submissions', 'project_submissions table is reachable.', async () => {
      await env.DB.prepare('SELECT COUNT(*) AS count FROM project_submissions').first()
    }),
    checkService('public-projects', 'Public Projects Query', 'Approved public project query is ready.', async () => {
      await env.DB.prepare(
        `SELECT COUNT(*) AS count
         FROM project_submissions
         WHERE moderation_status = ? AND visibility = ? AND deleted_at IS NULL`,
      )
        .bind('approved', 'public')
        .first()
    }),
    checkService('metrics', 'Metrics Query Readiness', 'Aggregate metrics queries are ready.', async () => {
      await env.DB.prepare(
        `SELECT
          (SELECT COUNT(*) FROM contact_messages WHERE deleted_at IS NULL) AS contact_count,
          (SELECT COUNT(*) FROM project_submissions WHERE deleted_at IS NULL) AS project_count`,
      ).first()
    }),
  ])

  const rawSummary = summarizeServices(services)
  const ok = rawSummary.offline === 0
  const summary = ok
    ? rawSummary
    : {
        ...rawSummary,
        degraded: rawSummary.degraded + rawSummary.offline,
        offline: 0,
      }

  return jsonResponse({
    ok,
    checkedAt,
    summary,
    services: services.map((service) => ({
      id: service.id,
      name: service.name,
      status: ok ? service.status : service.status === 'offline' ? 'degraded' : service.status,
      responseTimeMs: service.responseTimeMs,
      description: service.description,
      lastChecked: service.lastChecked,
    })),
  })
}
