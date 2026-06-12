import { apiDelete, apiGet, apiPatch, apiPost } from './apiClient'
import { appConfig } from '../config/appConfig'

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export function getAll3DProjects(token) {
  return apiGet('/api/admin/3d/projects', { headers: authHeaders(token) })
}

export function create3DProject(token, payload) {
  return apiPost('/api/admin/3d/projects', payload, { headers: authHeaders(token) })
}

export function update3DProject(token, id, payload) {
  return apiPatch(`/api/admin/3d/projects/${id}`, payload, { headers: authHeaders(token) })
}

export function delete3DProject(token, id) {
  return apiDelete(`/api/admin/3d/projects/${id}`, { headers: authHeaders(token) })
}

export function toggle3DProjectPublished(token, id, published) {
  return apiPatch(`/api/admin/3d/projects/${id}/publish`, { published }, { headers: authHeaders(token) })
}

export function toggle3DProjectFeatured(token, id, featured) {
  return apiPatch(`/api/admin/3d/projects/${id}/featured`, { featured }, { headers: authHeaders(token) })
}

async function adminRawRequest(path, token, options = {}) {
  if (!appConfig.isBackendEnabled) {
    throw new Error('Backend API is not enabled.')
  }

  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const response = await fetch(baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
  const text = await response.text()
  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Backend returned invalid JSON.')
  }

  if (!response.ok) {
    throw new Error(data?.message || `Backend request failed with status ${response.status}.`)
  }

  return data
}

export function upload3DMedia(token, { file, projectSlug, mediaType }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('projectSlug', projectSlug)
  formData.append('mediaType', mediaType)

  return adminRawRequest('/api/admin/3d/uploads', token, {
    method: 'POST',
    body: formData,
  })
}

export function delete3DMedia(token, payload) {
  return adminRawRequest('/api/admin/3d/uploads', token, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
