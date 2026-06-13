const controlCharactersPattern = /[\u0000-\u001f\u007f]/g
const controlCharactersExceptNewlinesPattern = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g
const repeatedSpacesPattern = /\s+/g
const horizontalSpacesPattern = /[ \t]+/g
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

export function sanitizeMultilineText(value, maxLength) {
  const normalized = String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(controlCharactersExceptNewlinesPattern, ' ')
    .split('\n')
    .map((line) => line.replace(horizontalSpacesPattern, ' ').trimEnd())
    .join('\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()

  if (normalized.length > maxLength) {
    return normalized.slice(0, maxLength).trim()
  }

  return normalized
}

export function normalizeEmail(email) {
  return sanitizeText(email, 120).toLowerCase()
}
