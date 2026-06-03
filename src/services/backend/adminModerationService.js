import { apiGet, apiPatch } from '../apiClient'

// Future Cloudflare Functions/Workers service for protected admin moderation routes.
export function listModerationQueue() {
  return apiGet('/api/admin/moderation-queue')
}

export function updateModerationStatus(id, status) {
  return apiPatch('/api/admin/moderation-queue', { id, status })
}
