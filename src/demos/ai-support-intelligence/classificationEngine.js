const categorySignals = [
  ['Account Access', ['login', 'password', 'access', 'reset', 'logout', 'account']],
  ['Billing', ['invoice', 'billing', 'charged', 'refund', 'payment', 'renewal', 'tax', 'price']],
  ['Bug Report', ['error', 'bug', '500', 'blank screen', 'not update', 'throws', 'token', 'working']],
  ['Sales', ['demo', 'pricing', 'enterprise', 'seats', 'migration', 'crm', 'subscription']],
  ['Technical Support', ['slow', 'dashboard', 'api', 'csv', 'analytics', 'export', 'settings']],
]

const negativeSignals = ['cannot', 'urgent', 'blocked', 'slow', 'error', 'critical', 'angry', 'failed', 'wrong']
const positiveSignals = ['great', 'helpful', 'excellent']

function signalMatches(text, signals) {
  return signals.filter((signal) => text.includes(signal))
}

export function classifyTicket(ticket) {
  const text = `${ticket.message || ''} ${ticket.rawCategory || ''}`.toLowerCase()
  const matched = categorySignals
    .map(([category, signals]) => ({ category, signals: signalMatches(text, signals) }))
    .filter((item) => item.signals.length)
    .sort((a, b) => b.signals.length - a.signals.length)

  const category = matched[0]?.category || 'General Question'
  const signals = matched[0]?.signals || []
  const priority = text.includes('critical') || text.includes('production') || text.includes('all production')
    ? 'Critical'
    : text.includes('urgent') || text.includes('blocked') || text.includes('500')
      ? 'High'
      : text.includes('slow') || text.includes('charged') || text.includes('wrong')
        ? 'Medium'
        : 'Low'
  const sentiment = signalMatches(text, negativeSignals).length
    ? 'Negative'
    : signalMatches(text, positiveSignals).length
      ? 'Positive'
      : 'Neutral'
  const ambiguityPenalty = category === 'General Question' || text.length < 40 ? 18 : 0
  const confidence = Math.max(48, Math.min(96, 62 + signals.length * 9 + (priority === 'Critical' ? 7 : 0) - ambiguityPenalty))
  const needsReview = confidence < 75 || priority === 'Critical' || category === 'General Question'

  return {
    ...ticket,
    category,
    priority,
    sentiment,
    confidence,
    summary: `${priority} ${category.toLowerCase()} case from ${ticket.channel}.`,
    recommendedAction: buildRecommendation(category, priority),
    reasoningSignals: signals.length ? signals : ['low-context', 'manual-review-suggested'],
    needsReview,
    reviewed: false,
    feedback: '',
  }
}

export function classifyTickets(tickets) {
  return tickets.map(classifyTicket)
}

export function categoryDistribution(tickets) {
  return tickets.reduce((acc, ticket) => {
    acc[ticket.category || 'Unclassified'] = (acc[ticket.category || 'Unclassified'] || 0) + 1
    return acc
  }, {})
}

function buildRecommendation(category, priority) {
  if (priority === 'Critical') return 'Escalate immediately, attach evidence and notify the incident owner.'
  if (category === 'Billing') return 'Route to billing team with invoice and subscription context.'
  if (category === 'Account Access') return 'Verify identity and send account recovery steps.'
  if (category === 'Bug Report') return 'Collect reproduction steps, environment and logs.'
  if (category === 'Sales') return 'Send to sales with company size and use case.'
  return 'Request additional context before automation.'
}
