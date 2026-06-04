import { appConfig } from '../../config/appConfig'
import { apiGet, apiPost } from '../apiClient'

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
