const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const phoneRegex = /(\+?\d[\d\s().-]{7,}\d)/g

export function detectSensitiveEntities(ticket) {
  const text = `${ticket.customerName || ''} ${ticket.email || ''} ${ticket.phone || ''} ${ticket.message || ''}`
  return {
    names: ticket.customerName ? 1 : 0,
    emails: (text.match(emailRegex) || []).length,
    phones: (text.match(phoneRegex) || []).length,
  }
}

export function maskSensitiveData(ticket) {
  const entities = detectSensitiveEntities(ticket)
  const maskedMessage = String(ticket.message || '')
    .replace(emailRegex, '[EMAIL]')
    .replace(phoneRegex, '[PHONE]')
    .replace(ticket.customerName || '__NO_NAME__', ticket.customerName ? '[CUSTOMER_NAME]' : '')

  return {
    ...ticket,
    customerName: ticket.customerName || 'Unknown customer',
    email: ticket.email ? '[EMAIL]' : 'missing-email',
    phone: ticket.phone ? '[PHONE]' : 'missing-phone',
    message: maskedMessage.replace(/\s+/g, ' ').trim(),
    privacyEntities: entities,
  }
}

export function summarizePrivacy(tickets) {
  return tickets.reduce(
    (acc, ticket) => {
      const entities = detectSensitiveEntities(ticket)
      acc.names += entities.names
      acc.emails += entities.emails
      acc.phones += entities.phones
      return acc
    },
    { names: 0, emails: 0, phones: 0 },
  )
}
