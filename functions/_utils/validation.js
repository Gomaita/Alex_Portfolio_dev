import { containsSuspiciousContent, normalizeEmail, sanitizeText } from './sanitize.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const allowedCategories = new Set([
  'API',
  'CRUD',
  'Frontend',
  'Database',
  'Security',
  'Tools',
  'Learning',
  'Other',
])

function addError(errors, field, message) {
  errors.push({ field, message })
}

function validateTextField(errors, data, field, label, maxLength, required = true) {
  const value = sanitizeText(data?.[field], maxLength)

  if (required && !value) {
    addError(errors, field, `${label} is required.`)
  }

  if (value && containsSuspiciousContent(data?.[field])) {
    addError(errors, field, `${label} contains unsupported content.`)
  }

  if (String(data?.[field] || '').length > maxLength) {
    addError(errors, field, `${label} is too long.`)
  }

  return value
}

export function validateContactMessage(data) {
  const errors = []
  const name = validateTextField(errors, data, 'name', 'Name', 80)
  const email = normalizeEmail(data?.email)
  const message = validateTextField(errors, data, 'message', 'Message', 2000)

  if (!email) {
    addError(errors, 'email', 'Email is required.')
  } else if (!emailPattern.test(email)) {
    addError(errors, 'email', 'Email format is invalid.')
  }

  if (containsSuspiciousContent(data?.email)) {
    addError(errors, 'email', 'Email contains unsupported content.')
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { name, email, message },
  }
}

export function validateProjectSubmission(data) {
  const errors = []
  const title = validateTextField(errors, data, 'title', 'Title', 120)
  const description = validateTextField(errors, data, 'description', 'Description', 1200)
  const submitterName = validateTextField(errors, data, 'submitterName', 'Submitter name', 80)
  const submitterEmail = normalizeEmail(data?.submitterEmail)
  const category = sanitizeText(data?.category, 40)
  const technologies = validateTextField(errors, data, 'technologies', 'Technologies', 300, false)

  if (submitterEmail && !emailPattern.test(submitterEmail)) {
    addError(errors, 'submitterEmail', 'Submitter email format is invalid.')
  }

  if (data?.submitterEmail && containsSuspiciousContent(data.submitterEmail)) {
    addError(errors, 'submitterEmail', 'Submitter email contains unsupported content.')
  }

  if (!category) {
    addError(errors, 'category', 'Category is required.')
  } else if (!allowedCategories.has(category)) {
    addError(errors, 'category', 'Category is not allowed.')
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      title,
      description,
      submitterName,
      submitterEmail,
      category,
      technologies,
    },
  }
}
