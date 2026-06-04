import { apiDelete, apiGet, apiPatch } from '../apiClient'

// Prepared for protected admin endpoints.
// Do not call these from the public frontend with a token. Admin actions should
// run from a secure internal tool or API client that can send Authorization.
export function listProjectSubmissions(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return apiGet(`/api/admin/project-submissions${query}`)
}

export function updateProjectSubmissionModeration({ id, action, adminNotes }) {
  return apiPatch('/api/admin/project-submissions', { id, action, adminNotes })
}

export function deleteProjectSubmission(id) {
  return apiDelete(`/api/admin/project-submissions?id=${encodeURIComponent(id)}`)
}

export function listContactMessages(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return apiGet(`/api/admin/contact-messages${query}`)
}

export function updateContactMessageStatus(id, status) {
  return apiPatch('/api/admin/contact-messages', { id, status })
}

export function archiveContactMessage(id) {
  return apiDelete(`/api/admin/contact-messages?id=${encodeURIComponent(id)}`)
}
