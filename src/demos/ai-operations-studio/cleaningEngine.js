const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const phoneRegex = /(\+?\d[\d\s().-]{7,}\d)/g

export const cleaningSteps = [
  {
    id: 'dedupe',
    title: 'Remove duplicates',
    description: 'Detects repeated customer messages and keeps the earliest useful record.',
  },
  {
    id: 'fill',
    title: 'Fill empty fields',
    description: 'Adds safe fallback values for missing customer and channel fields.',
  },
  {
    id: 'normalize',
    title: 'Normalize text',
    description: 'Trims whitespace and standardizes message spacing for downstream analysis.',
  },
  {
    id: 'mask',
    title: 'Mask personal data',
    description: 'Masks emails and phone numbers before model processing.',
  },
  {
    id: 'invalid',
    title: 'Detect invalid rows',
    description: 'Flags rows with missing messages or weak metadata.',
  },
]

export function runCleaningPipeline(tickets) {
  const logs = []
  const seen = new Set()
  const cleaned = []
  let duplicates = 0
  let filledFields = 0
  let maskedFields = 0
  let invalidRows = 0

  tickets.forEach((ticket) => {
    const signature = `${ticket.customer || 'unknown'}-${ticket.message || ''}`.toLowerCase().replace(/\s+/g, ' ').trim()
    if (seen.has(signature)) {
      duplicates += 1
      return
    }
    seen.add(signature)

    const missingCustomer = !ticket.customer
    const missingChannel = !ticket.channel
    const normalizedMessage = String(ticket.message || '').replace(/\s+/g, ' ').trim()
    const maskedMessage = normalizedMessage
      .replace(emailRegex, '[masked-email]')
      .replace(phoneRegex, '[masked-phone]')

    if (missingCustomer) filledFields += 1
    if (missingChannel) filledFields += 1
    if (maskedMessage !== normalizedMessage) maskedFields += 1
    if (!normalizedMessage || !ticket.date) invalidRows += 1

    cleaned.push({
      ...ticket,
      customer: ticket.customer || 'Unknown customer',
      channel: ticket.channel || 'Unknown',
      message: maskedMessage,
      isValid: Boolean(normalizedMessage && ticket.date),
    })
  })

  logs.push(`Removed ${duplicates} duplicate row${duplicates === 1 ? '' : 's'}.`)
  logs.push(`Filled ${filledFields} empty field${filledFields === 1 ? '' : 's'}.`)
  logs.push(`Normalized ${cleaned.length} message${cleaned.length === 1 ? '' : 's'}.`)
  logs.push(`Masked personal data in ${maskedFields} ticket${maskedFields === 1 ? '' : 's'}.`)
  logs.push(`Detected ${invalidRows} invalid row${invalidRows === 1 ? '' : 's'}.`)

  return {
    tickets: cleaned,
    logs,
    stats: {
      duplicates,
      filledFields,
      maskedFields,
      invalidRows,
      before: tickets.length,
      after: cleaned.length,
    },
  }
}
