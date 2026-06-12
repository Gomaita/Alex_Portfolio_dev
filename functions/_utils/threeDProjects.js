import { sanitizeText } from './sanitize.js'

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function parseJsonArray(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function cleanArray(value, max = 30) {
  return Array.isArray(value) ? value.slice(0, max) : []
}

function cleanObjectArray(value, max = 40) {
  return Array.isArray(value)
    ? value.slice(0, max).filter((item) => item && typeof item === 'object')
    : []
}

export function map3DProject(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    date: row.date || '',
    year: row.year || '',
    category: row.category || 'Personal Project',
    role: row.role || '',
    thumbnailUrl: row.thumbnail_url || '',
    heroImageUrl: row.hero_image_url || '',
    images: parseJsonArray(row.images_json),
    tools: parseJsonArray(row.tools_json),
    techniques: parseJsonArray(row.techniques_json),
    externalLinks: parseJsonArray(row.external_links_json),
    breakdown: row.breakdown || '',
    technicalNotes: row.technical_notes || '',
    engine: row.engine || '',
    assetType: row.asset_type || '',
    polycount: row.polycount || '',
    textureResolution: row.texture_resolution || '',
    texelDensity: row.texel_density || '',
    targetPlatform: row.target_platform || '',
    timeSpent: row.time_spent || '',
    softwareUsed: parseJsonArray(row.software_used_json),
    categories: parseJsonArray(row.categories_json),
    tags: parseJsonArray(row.tags_json),
    materials: parseJsonArray(row.materials_json),
    shaderNotes: row.shader_notes || '',
    optimizationNotes: row.optimization_notes || '',
    textureWorkflow: row.texture_workflow || '',
    substancePainterNotes: row.substance_painter_notes || '',
    substanceDesignerNotes: row.substance_designer_notes || '',
    textureMaps: parseJsonArray(row.texture_maps_json),
    contentBlocks: parseJsonArray(row.content_blocks_json),
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || '',
  }
}

export function validate3DProjectPayload(data) {
  const title = sanitizeText(data?.title, 140)
  const slug = slugify(data?.slug || title)

  if (!title) return { ok: false, message: 'Title is required.' }
  if (!slug) return { ok: false, message: 'A valid slug is required.' }

  return {
    ok: true,
    value: {
      slug,
      title,
      subtitle: sanitizeText(data?.subtitle, 180),
      description: sanitizeText(data?.description, 2000),
      date: sanitizeText(data?.date, 80),
      year: sanitizeText(data?.year, 20),
      category: sanitizeText(data?.category, 80) || 'Personal Project',
      role: sanitizeText(data?.role, 160),
      thumbnailUrl: sanitizeText(data?.thumbnailUrl, 500),
      heroImageUrl: sanitizeText(data?.heroImageUrl, 500),
      images: cleanObjectArray(data?.images),
      tools: cleanArray(data?.tools),
      techniques: cleanArray(data?.techniques),
      externalLinks: cleanObjectArray(data?.externalLinks),
      breakdown: sanitizeText(data?.breakdown, 3000),
      technicalNotes: sanitizeText(data?.technicalNotes, 3000),
      engine: sanitizeText(data?.engine, 120),
      assetType: sanitizeText(data?.assetType, 120),
      polycount: sanitizeText(data?.polycount, 80),
      textureResolution: sanitizeText(data?.textureResolution, 80),
      texelDensity: sanitizeText(data?.texelDensity, 80),
      targetPlatform: sanitizeText(data?.targetPlatform, 120),
      timeSpent: sanitizeText(data?.timeSpent, 80),
      softwareUsed: cleanArray(data?.softwareUsed),
      categories: cleanArray(data?.categories),
      tags: cleanArray(data?.tags),
      materials: cleanArray(data?.materials),
      shaderNotes: sanitizeText(data?.shaderNotes, 3000),
      optimizationNotes: sanitizeText(data?.optimizationNotes, 3000),
      textureWorkflow: sanitizeText(data?.textureWorkflow, 120),
      substancePainterNotes: sanitizeText(data?.substancePainterNotes, 3000),
      substanceDesignerNotes: sanitizeText(data?.substanceDesignerNotes, 3000),
      textureMaps: cleanObjectArray(data?.textureMaps),
      contentBlocks: cleanObjectArray(data?.contentBlocks),
      published: data?.published ? 1 : 0,
      featured: data?.featured ? 1 : 0,
      sortOrder: Number(data?.sortOrder || 0),
      publishedAt: sanitizeText(data?.publishedAt, 80),
    },
  }
}

export function bind3DProjectValues(project) {
  return [
    project.slug,
    project.title,
    project.subtitle,
    project.description,
    project.date,
    project.year,
    project.category,
    project.role,
    project.thumbnailUrl,
    project.heroImageUrl,
    JSON.stringify(project.images),
    JSON.stringify(project.tools),
    JSON.stringify(project.techniques),
    JSON.stringify(project.externalLinks),
    project.breakdown,
    project.technicalNotes,
    project.engine,
    project.assetType,
    project.polycount,
    project.textureResolution,
    project.texelDensity,
    project.targetPlatform,
    project.timeSpent,
    JSON.stringify(project.softwareUsed),
    JSON.stringify(project.categories),
    JSON.stringify(project.tags),
    JSON.stringify(project.materials),
    project.shaderNotes,
    project.optimizationNotes,
    project.textureWorkflow,
    project.substancePainterNotes,
    project.substanceDesignerNotes,
    JSON.stringify(project.textureMaps),
    JSON.stringify(project.contentBlocks),
    project.published,
    project.featured,
    project.sortOrder,
    project.publishedAt,
  ]
}
