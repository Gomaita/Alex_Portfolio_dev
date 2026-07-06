export const knowledgeDocuments = [
  {
    id: 'support-policy',
    title: 'Support Policy',
    tags: ['support', 'priority', 'sla', 'escalation'],
    content:
      'High priority support cases include login blockers, production errors, failed exports and customer-impacting incidents. The team should acknowledge high priority tickets within 30 minutes and escalate reproducible bugs with logs.',
  },
  {
    id: 'billing-faq',
    title: 'Billing FAQ',
    tags: ['billing', 'invoice', 'payment', 'subscription'],
    content:
      'Billing questions should include invoice ID, customer account, billing period and seat count. Failed payments can be retried after validating the payment method and subscription status.',
  },
  {
    id: 'technical-troubleshooting',
    title: 'Technical Troubleshooting Guide',
    tags: ['login', 'slow', 'error', 'csv', 'analytics', 'troubleshooting'],
    content:
      'Technical troubleshooting starts with reproduction steps, affected browser or device, recent changes and logs. For slow dashboards, check imported data size, analytics jobs and chart refresh status.',
  },
]

export function askKnowledgeBase(question) {
  const query = question.toLowerCase()
  const scored = knowledgeDocuments
    .map((doc) => {
      const tagScore = doc.tags.filter((tag) => query.includes(tag)).length * 2
      const contentScore = doc.content
        .toLowerCase()
        .split(/[., ]+/)
        .filter((word) => word.length > 4 && query.includes(word)).length
      return { ...doc, score: tagScore + contentScore }
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)

  const sources = scored.length ? scored.slice(0, 2) : [knowledgeDocuments[0]]
  const confidence = Math.min(0.94, 0.54 + sources.reduce((sum, doc) => sum + doc.score, 0) * 0.08)
  const answer = sources.length
    ? `Based on ${sources.map((source) => source.title).join(' and ')}, the recommended next step is to collect the key context, assign the right priority and route the issue to the correct owner.`
    : 'I could not find a strong policy match, so I would ask for more context before recommending an action.'

  return {
    answer,
    sources,
    confidence,
    snippets: sources.map((source) => source.content),
  }
}
