import { appConfig } from '../config/appConfig'

const REQUEST_TIMEOUT_MS = 30000

export async function sendNovaMessage({ message, messages, mode }) {
  if (!appConfig.isBackendEnabled) {
    return {
      ok: true,
      demoMode: true,
      provider: 'demo',
      model: 'local-demo',
      mode,
      reply: `Demo mode is active because the backend is not connected in this local build.\n\nYou said: "${message}"\n\nThe full deployed version can call /api/ai-chat when AI environment variables are configured.`,
    }
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, '')
  const url = baseUrl ? `${baseUrl}/api/ai-chat` : '/api/ai-chat'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({ message, messages, mode }),
    })

    const text = await response.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      throw new Error('Backend returned invalid JSON.')
    }

    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || data?.error || 'Nova could not answer right now.')
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Nova timed out. Please try again in a moment.')
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}
