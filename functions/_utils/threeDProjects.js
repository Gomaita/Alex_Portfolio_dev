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

function cleanArray(value, max = 24) {
  return Array.isArray(value) ? value.slice(0, max) : []
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
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function validate3DProjectPayload(data) {
  const title = sanitizeText(data?.title, 140)
  const slug = slugify(data?.slug || title)

  if (!title) {
    return { ok: false, message: 'Title is required.' }
  }

  if (!slug) {
    return { ok: false, message: 'A valid slug is required.' }
  }

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
      images: cleanArray(data?.images),
      tools: cleanArray(data?.tools),
      techniques: cleanArray(data?.techniques),
      externalLinks: cleanArray(data?.externalLinks),
      breakdown: sanitizeText(data?.breakdown, 3000),
      technicalNotes: sanitizeText(data?.technicalNotes, 3000),
      published: data?.published ? 1 : 0,
      featured: data?.featured ? 1 : 0,
      sortOrder: Number(data?.sortOrder || 0),
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
    project.published,
    project.featured,
    project.sortOrder,
  ]
}
