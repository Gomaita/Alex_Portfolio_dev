import { errorResponse } from './response.js'

export function requireAdmin(context) {
  const expectedToken = context.env?.ADMIN_API_TOKEN

  if (!expectedToken) {
    return {
      ok: false,
      response: errorResponse('Admin API token is not configured.', 401),
    }
  }

  const header = context.request.headers.get('Authorization') || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token || token !== expectedToken) {
    return {
      ok: false,
      response: errorResponse('Unauthorized.', 401),
    }
  }

  return { ok: true, actor: 'admin' }
}
