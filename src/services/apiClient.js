import { appConfig } from '../config/appConfig'

const DEFAULT_TIMEOUT_MS = 8000

function ensureBackendEnabled() {
  if (!appConfig.isBackendEnabled) {
    throw new Error('Backend API is not enabled. Current demos are running in local educational mode.')
  }
}

async function parseResponse(response) {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Backend returned invalid JSON.')
  }
}

async function apiRequest(path, options = {}) {
  ensureBackendEnabled()

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)
  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    })
    const data = await parseResponse(response)

    if (!response.ok) {
      throw new Error(data?.message || `Backend request failed with status ${response.status}.`)
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Backend request timed out.')
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function apiGet(path) {
  return apiRequest(path, { method: 'GET' })
}

export function apiPost(path, payload) {
  return apiRequest(path, { method: 'POST', body: JSON.stringify(payload) })
}

export function apiPatch(path, payload) {
  return apiRequest(path, { method: 'PATCH', body: JSON.stringify(payload) })
}

export function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' })
}
