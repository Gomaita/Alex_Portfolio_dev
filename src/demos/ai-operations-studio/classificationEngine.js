const categoryRules = [
  ['Technical Support', ['login', 'password', 'invite', 'admin', 'access']],
  ['Billing', ['invoice', 'billing', 'payment', 'subscription', 'unpaid', 'seats']],
  ['Bug Report', ['error', '500', 'slow', 'not updating', 'throws', 'blocking', 'failed']],
  ['Sales', ['pricing', 'enterprise', 'demo', 'sales', 'onboarding']],
]

const positiveWords = ['great', 'thanks', 'good', 'helpful', 'love']
const negativeWords = ['cannot', 'failed', 'error', 'slow', 'blocking', 'unpaid', 'twice']

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term))
}

export function classifyTicket(ticket) {
  const text = `${ticket.message || ''} ${ticket.status || ''}`.toLowerCase()
  const categoryMatch = categoryRules.find(([, terms]) => containsAny(text, terms))
  const category = categoryMatch?.[0] || 'General Question'
  const priority = text.includes('blocking') || text.includes('500') || text.includes('failed')
    ? 'High'
    : text.includes('slow') || text.includes('unpaid')
      ? 'Medium'
      : 'Low'
  const sentiment = containsAny(text, negativeWords)
    ? 'Negative'
    : containsAny(text, positiveWords)
      ? 'Positive'
      : 'Neutral'
  const confidence = Math.min(0.96, 0.68 + (categoryMatch ? 0.18 : 0) + (priority === 'High' ? 0.07 : 0))

  return {
    ...ticket,
    category,
    priority,
    sentiment,
    confidence,
    summary: buildSummary(ticket.message, category, priority),
  }
}

export function classifyTickets(tickets) {
  return tickets.map(classifyTicket)
}

export function getCategoryDistribution(classifiedTickets) {
  return classifiedTickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1
    return acc
  }, {})
}

function buildSummary(message = '', category, priority) {
  const clean = message.replace(/\s+/g, ' ').trim()
  const shortText = clean.length > 84 ? `${clean.slice(0, 84)}...` : clean
  return `${priority} priority ${category.toLowerCase()} case: ${shortText}`
}
