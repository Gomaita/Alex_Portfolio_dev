import { requireAdmin } from '../../../../_utils/auth.js'
import { errorResponse, jsonResponse } from '../../../../_utils/response.js'
import { bind3DProjectValues, validate3DProjectPayload } from '../../../../_utils/threeDProjects.js'

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function safeJsonParse(value, fallback = null) {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function sanitizeSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractR2KeyFromUrl(value) {
  if (!value) return null
  const rawValue = String(value).trim()
  if (!rawValue) return null

  if (rawValue.startsWith('3d/projects/')) return rawValue
  if (rawValue.startsWith('/3d/projects/')) return rawValue.replace(/^\/+/, '')

  try {
    const url = new URL(rawValue)
    if (url.hostname !== 'media.alexgl.dev') return null
    return decodeURIComponent(url.pathname.replace(/^\/+/, ''))
  } catch {
    return null
  }
}

function collectImageKeysFromValue(value, keys) {
  if (!value) return

  if (typeof value === 'string') {
    const key = extractR2KeyFromUrl(value)
    if (key) keys.add(key)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageKeysFromValue(item, keys))
    return
  }

  if (typeof value === 'object') {
    collectImageKeysFromValue(value.key, keys)
    collectImageKeysFromValue(value.url, keys)
    collectImageKeysFromValue(value.image, keys)
    collectImageKeysFromValue(value.images, keys)
    collectImageKeysFromValue(value.blocks, keys)
  }
}

function collectProjectMediaKeys(project) {
  const keys = new Set()
  collectImageKeysFromValue(project.thumbnail_url, keys)
  collectImageKeysFromValue(project.hero_image_url, keys)
  collectImageKeysFromValue(safeJsonParse(project.images_json, []), keys)
  collectImageKeysFromValue(safeJsonParse(project.texture_maps_json, []), keys)
  collectImageKeysFromValue(safeJsonParse(project.content_blocks_json, []), keys)
  return keys
}

async function deleteR2ProjectMedia(bucket, projectSlug) {
  const safeSlug = sanitizeSlug(projectSlug)
  if (!safeSlug) {
    return {
      ok: false,
      error: 'Project slug is required to delete R2 media',
      deletedCount: 0,
      errors: [],
    }
  }

  const prefix = `3d/projects/${safeSlug}/`
  if (!prefix.startsWith('3d/projects/') || prefix === '3d/projects/') {
    return {
      ok: false,
      error: 'Unsafe R2 media prefix',
      deletedCount: 0,
      errors: [],
    }
  }

  let deletedCount = 0
  const errors = []
  const deletedKeys = new Set()
  let cursor

  try {
    do {
      const listed = await bucket.list({ prefix, cursor })
      const keys = (listed.objects || [])
        .map((object) => object.key)
        .filter((key) => key?.startsWith(prefix))

      for (const key of keys) {
        try {
          await bucket.delete(key)
          deletedCount += 1
          deletedKeys.add(key)
        } catch (error) {
          errors.push({ key, error: String(error?.message || 'Failed to delete object') })
        }
      }

      cursor = listed.truncated ? listed.cursor : undefined
    } while (cursor)
  } catch (error) {
    return {
      ok: false,
      error: 'Failed to delete project media from R2',
      details: String(error?.message || 'R2 list failed'),
      deletedCount,
      deletedKeys,
      errors,
    }
  }

  return { ok: true, prefix, deletedCount, deletedKeys, errors }
}

async function deleteExplicitR2Keys(bucket, keys, prefix) {
  let deletedCount = 0
  const errors = []

  for (const key of keys) {
    if (!key?.startsWith(prefix)) continue
    try {
      await bucket.delete(key)
      deletedCount += 1
    } catch (error) {
      errors.push({ key, error: String(error?.message || 'Failed to delete object') })
    }
  }

  return { deletedCount, errors }
}

export async function onRequestPatch(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { request, env, params } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)

  const data = await readJson(request)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const validation = validate3DProjectPayload(data)
  if (!validation.ok) return errorResponse(validation.message, 400)

  const now = new Date().toISOString()
  const project = validation.value
  if (project.published && !project.publishedAt) project.publishedAt = now

  try {
    const result = await env.DB.prepare(
      `UPDATE portfolio_3d_projects
       SET slug = ?, title = ?, subtitle = ?, description = ?, date = ?, year = ?,
           category = ?, role = ?, thumbnail_url = ?, hero_image_url = ?,
           images_json = ?, tools_json = ?, techniques_json = ?, external_links_json = ?,
           breakdown = ?, technical_notes = ?, engine = ?, asset_type = ?,
           polycount = ?, texture_resolution = ?, texel_density = ?,
           target_platform = ?, time_spent = ?, software_used_json = ?,
           categories_json = ?, tags_json = ?, materials_json = ?,
           shader_notes = ?, optimization_notes = ?, texture_workflow = ?,
           substance_painter_notes = ?, substance_designer_notes = ?,
           texture_maps_json = ?, content_blocks_json = ?, published = ?,
           featured = ?, sort_order = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
      .bind(...bind3DProjectValues(project), now, params.id)
      .run()

    if (!result.meta?.changes) return errorResponse('3D project not found.', 404)
  } catch (error) {
    const message = String(error?.message || '')
    if (message.includes('no such column') || message.includes('has no column')) {
      return errorResponse('D1 schema is missing 3D portfolio columns. Run the 3D R2 migration first.', 500)
    }
    return errorResponse('A project with this slug already exists.', 409)
  }

  return jsonResponse({ ok: true, message: '3D project updated.' })
}

export async function onRequestDelete(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response
  const { env, params } = context
  if (!env.DB) return errorResponse('Database binding is not configured.', 500)
  if (!env.MEDIA_BUCKET) return errorResponse('R2 bucket binding MEDIA_BUCKET is not configured', 500)

  const projectId = String(params.id || '').trim()
  if (!projectId) return errorResponse('Project id is required.', 400)

  let result
  let existingProject
  let r2DeletedCount = 0
  let r2Errors = []
  let r2Prefix = ''

  try {
    existingProject = await env.DB.prepare(
      `SELECT id, slug, thumbnail_url, hero_image_url, content_blocks_json,
              images_json, texture_maps_json
       FROM portfolio_3d_projects
       WHERE id = ?`,
    )
      .bind(projectId)
      .first()

    if (!existingProject) return errorResponse('Project not found.', 404)

    const safeSlug = sanitizeSlug(existingProject.slug)
    if (!safeSlug) return errorResponse('Project slug is required to delete R2 media', 400)

    r2Prefix = `3d/projects/${safeSlug}/`
    const prefixDeletion = await deleteR2ProjectMedia(env.MEDIA_BUCKET, existingProject.slug)
    if (!prefixDeletion.ok) {
      return jsonResponse({
        ok: false,
        error: prefixDeletion.error,
        message: prefixDeletion.error,
        details: prefixDeletion.details,
        r2DeletedCount: prefixDeletion.deletedCount,
        r2Errors: prefixDeletion.errors,
      }, 500)
    }

    r2DeletedCount += prefixDeletion.deletedCount
    r2Errors = [...r2Errors, ...prefixDeletion.errors]

    const explicitKeys = new Set([...collectProjectMediaKeys(existingProject)].filter((key) => !prefixDeletion.deletedKeys.has(key)))
    const explicitDeletion = await deleteExplicitR2Keys(env.MEDIA_BUCKET, explicitKeys, r2Prefix)
    r2DeletedCount += explicitDeletion.deletedCount
    r2Errors = [...r2Errors, ...explicitDeletion.errors]

    result = await env.DB.prepare('DELETE FROM portfolio_3d_projects WHERE id = ?')
      .bind(projectId)
      .run()
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: 'Failed to delete project.',
      message: 'Failed to delete project.',
      details: String(error?.message || 'Unexpected delete failure'),
    }, 500)
  }

  if (!result.meta?.changes) return errorResponse('Project not found.', 404)

  return jsonResponse({
    ok: true,
    deletedId: projectId,
    deletedSlug: existingProject.slug,
    r2Prefix,
    r2DeletedCount,
    r2Errors,
    ...(r2Errors.length ? { warning: 'Project deleted, but some R2 media could not be removed' } : {}),
  })
}
