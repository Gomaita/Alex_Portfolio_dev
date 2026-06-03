import { apiPost } from '../apiClient'
import { appConfig } from '../../config/appConfig'

// Future Cloudflare Functions/Workers service. The current contact UI remains frontend-only.
export function createContactMessage(data) {
  if (!appConfig.isBackendEnabled) {
    return Promise.reject(
      new Error('The backend is not connected in this demo build. Please use the email link.'),
    )
  }

  return apiPost('/api/contact', data)
}
