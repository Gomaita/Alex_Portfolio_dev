import { apiDelete, apiGet, apiPatch, apiPost } from '../apiClient'
import { appConfig } from '../../config/appConfig'

// Future Cloudflare Functions/Workers service. Local demos still use localStorage.
export function createProjectSubmission(data) {
  if (!appConfig.isBackendEnabled) {
    return Promise.reject(
      new Error('Backend is disabled. Project submissions are local demo data in this build.'),
    )
  }

  return apiPost('/api/project-submissions', data)
}

export function listApprovedProjects() {
  if (!appConfig.isBackendEnabled) {
    return Promise.resolve([])
  }

  return apiGet('/api/projects/public')
}

export function listPendingProjects() {
  if (!appConfig.isBackendEnabled) {
    return Promise.resolve([])
  }

  return apiGet('/api/admin/project-submissions')
}

export function approveProject(id) {
  if (!appConfig.isBackendEnabled) {
    return Promise.reject(new Error('Backend is disabled.'))
  }

  return apiPatch('/api/admin/project-submissions', { id, action: 'approve' })
}

export function rejectProject(id, reason) {
  if (!appConfig.isBackendEnabled) {
    return Promise.reject(new Error('Backend is disabled.'))
  }

  return apiPatch('/api/admin/project-submissions', {
    id,
    action: 'reject',
    adminNotes: reason,
  })
}

export function deleteProjectSubmission(id) {
  if (!appConfig.isBackendEnabled) {
    return Promise.reject(new Error('Backend is disabled.'))
  }

  return apiDelete(`/api/admin/project-submissions?id=${encodeURIComponent(id)}`)
}
