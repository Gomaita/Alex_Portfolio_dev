const controlCharactersPattern = /[\u0000-\u001f\u007f]/g
const repeatedSpacesPattern = /\s+/g
const suspiciousPatterns = [
  /<\s*script/i,
  /<\/?[a-z][\s\S]*>/i,
  /javascript:/i,
  /on\w+\s*=/i,
]

export function containsSuspiciousContent(value) {
  const text = String(value || '')
  return suspiciousPatterns.some((pattern) => pattern.test(text))
}

export function sanitizeText(value, maxLength) {
  const normalized = String(value || '')
    .replace(controlCharactersPattern, ' ')
    .replace(repeatedSpacesPattern, ' ')
    .trim()

  if (normalized.length > maxLength) {
    return normalized.slice(0, maxLength).trim()
  }

  return normalized
}

export function normalizeEmail(email) {
  return sanitizeText(email, 120).toLowerCase()
}
