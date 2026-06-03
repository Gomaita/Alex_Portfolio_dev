export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}

export function errorResponse(message, status = 400, details = null) {
  return jsonResponse(
    {
      ok: false,
      message,
      ...(details ? { details } : {}),
    },
    status,
  )
}
