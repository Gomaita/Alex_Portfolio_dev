import { maskSensitiveData, summarizePrivacy } from './privacyEngine'

export const cleaningSteps = [
  'Remove duplicates',
  'Fill missing fields',
  'Normalize text',
  'Detect sensitive data',
  'Mask personal information',
  'Validate clean records',
]

export function inspectDataset(tickets) {
  const signatures = new Set()
  let duplicates = 0
  let missingFields = 0
  const channels = new Set()

  tickets.forEach((ticket) => {
    const signature = `${ticket.customerName}-${ticket.message}`.toLowerCase()
    if (signatures.has(signature)) duplicates += 1
    signatures.add(signature)
    if (!ticket.customerName || !ticket.email || !ticket.phone || !ticket.channel) missingFields += 1
    channels.add(ticket.channel || 'missing')
  })

  return {
    totalRows: tickets.length,
    duplicatedRows: duplicates,
    missingFields,
    sensitiveData: summarizePrivacy(tickets),
    dateRange: `${tickets[0]?.date || '-'} → ${tickets.at(-1)?.date || '-'}`,
    channels: Array.from(channels),
  }
}

export function runCleaningPipeline(tickets) {
  const signatures = new Set()
  const logs = []
  let duplicates = 0
  let filledFields = 0
  let invalidRows = 0

  const cleaned = tickets.flatMap((ticket) => {
    const signature = `${ticket.customerName}-${ticket.message}`.toLowerCase().replace(/\s+/g, ' ').trim()
    if (signatures.has(signature)) {
      duplicates += 1
      return []
    }
    signatures.add(signature)

    const normalized = {
      ...ticket,
      customerName: ticket.customerName || 'Unknown customer',
      email: ticket.email || 'missing-email',
      phone: ticket.phone || 'missing-phone',
      channel: ticket.channel || 'web',
      message: String(ticket.message || '').replace(/\s+/g, ' ').trim(),
    }

    filledFields += ['customerName', 'email', 'phone', 'channel'].filter((field) => !ticket[field]).length
    if (!normalized.message || !normalized.date) invalidRows += 1

    return [{ ...maskSensitiveData(normalized), isValid: Boolean(normalized.message && normalized.date) }]
  })

  const privacy = cleaned.reduce(
    (acc, ticket) => {
      acc.names += ticket.privacyEntities?.names || 0
      acc.emails += ticket.privacyEntities?.emails || 0
      acc.phones += ticket.privacyEntities?.phones || 0
      return acc
    },
    { names: 0, emails: 0, phones: 0 },
  )

  logs.push(`Removed ${duplicates} duplicate tickets`)
  logs.push(`Filled ${filledFields} missing fields`)
  logs.push(`Masked ${privacy.names + privacy.emails + privacy.phones} sensitive entities`)
  logs.push(`Validated ${cleaned.length - invalidRows}/${cleaned.length} clean records`)

  return {
    tickets: cleaned,
    logs,
    stats: {
      before: tickets.length,
      after: cleaned.length,
      duplicates,
      filledFields,
      invalidRows,
      privacy,
    },
  }
}
