import { apiDelete, apiGet, apiPatch, apiPost } from './apiClient'

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
