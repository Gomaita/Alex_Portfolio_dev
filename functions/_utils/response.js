export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
  })
}

export function errorResponse(message, status = 400, details = null) {
  return jsonResponse(
    {
      ok: false,
      error: message,
      message,
      ...(details ? { details } : {}),
    },
    status,
  )
}
