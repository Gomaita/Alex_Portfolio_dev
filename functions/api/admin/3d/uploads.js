import { requireAdmin } from '../../../_utils/auth.js'
import { errorResponse, jsonResponse } from '../../../_utils/response.js'
import { slugify } from '../../../_utils/threeDProjects.js'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
])

const MEDIA_FOLDERS = {
  thumbnail: 'thumbnail',
  hero: 'hero',
  'main-render': 'media',
  'final-render': 'final',
  gallery: 'media',
  closeup: 'closeups',
  breakdown: 'breakdown',
  'texture-map': 'textures',
  uv: 'uv',
  wireframe: 'wireframe',
  material: 'material',
  engine: 'engine',
  other: 'other',
}

function getPublicBaseUrl(env) {
  return (env.MEDIA_PUBLIC_BASE_URL || 'https://media.alexgl.dev').replace(/\/$/, '')
}

function getExtension(fileName, contentType) {
  const fromName = String(fileName || '').toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]
  if (fromName) return fromName === 'jpeg' ? 'jpg' : fromName
  if (contentType === 'image/jpeg') return 'jpg'
  if (contentType === 'image/png') return 'png'
  if (contentType === 'image/webp') return 'webp'
  if (contentType === 'image/avif') return 'avif'
  return 'img'
}

function getSafeFileName(fileName, contentType) {
  const extension = getExtension(fileName, contentType)
  const withoutExtension = String(fileName || 'image')
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'image'

  return `${withoutExtension}-${Date.now().toString(36)}.${extension}`
}

function keyFromUrlOrKey(value, publicBaseUrl) {
  const cleanValue = String(value || '').trim()
  if (!cleanValue) return ''
  if (cleanValue.startsWith('3d/projects/')) return cleanValue
  if (cleanValue.startsWith(`${publicBaseUrl}/`)) return cleanValue.slice(publicBaseUrl.length + 1)
  try {
    const url = new URL(cleanValue)
    return url.pathname.replace(/^\/+/, '')
  } catch {
    return ''
  }
}

export async function onRequestPost(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response

  const { request, env } = context
  if (!env.MEDIA_BUCKET) return errorResponse('R2 media bucket binding is not configured.', 500)

  const formData = await request.formData().catch(() => null)
  if (!formData) return errorResponse('Invalid upload payload.', 400)

  const file = formData.get('file')
  const projectSlug = slugify(formData.get('projectSlug'))
  const mediaType = String(formData.get('mediaType') || 'other')
  const folder = MEDIA_FOLDERS[mediaType]

  if (!file || typeof file !== 'object' || !file.stream) return errorResponse('Image file is required.', 400)
  if (!projectSlug) return errorResponse('Project slug is required before uploading media.', 400)
  if (!folder) return errorResponse('Invalid media type.', 400)
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return errorResponse('Only JPG, PNG, WebP and AVIF images are allowed.', 400)
  if (file.size > MAX_FILE_SIZE) return errorResponse('File is too large. Please upload an optimized image under 15 MB.', 413)

  const safeFileName = getSafeFileName(file.name, file.type)
  const key = `3d/projects/${projectSlug}/${folder}/${safeFileName}`

  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  })

  const publicBaseUrl = getPublicBaseUrl(env)

  return jsonResponse({
    ok: true,
    key,
    url: `${publicBaseUrl}/${key}`,
    contentType: file.type,
    size: file.size,
  })
}

export async function onRequestDelete(context) {
  const auth = requireAdmin(context)
  if (!auth.ok) return auth.response

  const { request, env } = context
  if (!env.MEDIA_BUCKET) return errorResponse('R2 media bucket binding is not configured.', 500)

  const data = await request.json().catch(() => null)
  if (!data) return errorResponse('Invalid JSON payload.', 400)

  const key = keyFromUrlOrKey(data.key || data.url, getPublicBaseUrl(env))
  if (!key || !key.startsWith('3d/projects/')) {
    return errorResponse('Only 3D project media can be deleted.', 400)
  }

  await env.MEDIA_BUCKET.delete(key)

  return jsonResponse({ ok: true, message: 'Media deleted.', key })
}
