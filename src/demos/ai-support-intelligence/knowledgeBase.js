export const knowledgeDocs = [
  {
    id: 'support-policy',
    title: 'Support Policy',
    tags: ['escalation', 'priority', 'critical', 'support', 'incident'],
    content:
      'Critical incidents, login blockers and production failures must be acknowledged quickly, escalated with evidence and assigned to an incident owner. Support should document assumptions and request reproduction steps.',
  },
  {
    id: 'billing-faq',
    title: 'Billing FAQ',
    tags: ['billing', 'invoice', 'charged', 'refund', 'payment', 'renewal'],
    content:
      'Duplicated charges and invoice disputes should be routed to billing with invoice ID, payment date, customer account and subscription period. Support should avoid promising refunds before finance confirms the case.',
  },
  {
    id: 'account-access',
    title: 'Account Access Guide',
    tags: ['login', 'password', 'access', 'account', 'reset', 'admin'],
    content:
      'Account access cases require identity verification, a secure reset flow and confirmation that private data is not exposed. Admin invitations should be handled through verified workspace owners.',
  },
  {
    id: 'troubleshooting',
    title: 'Technical Troubleshooting Guide',
    tags: ['slow', 'error', 'api', 'csv', 'analytics', 'dashboard', 'export'],
    content:
      'Technical cases should include browser, device, logs, reproduction steps, affected dataset and recent changes. Slow dashboards often require checking imports, scheduled jobs and chart refresh status.',
  },
]

export const sampleQuestions = [
  'What should we do when a customer cannot access their account?',
  'How should duplicated billing issues be handled?',
  'When should a ticket be escalated?',
  'What information should not be exposed?',
]

export function askKnowledgeAssistant(question) {
  const query = question.toLowerCase()
  const scored = knowledgeDocs
    .map((doc) => {
      const tagScore = doc.tags.filter((tag) => query.includes(tag)).length * 3
      const contentScore = doc.content
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 5 && query.includes(word)).length
      return { ...doc, score: tagScore + contentScore }
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)

  const sources = scored.length ? scored.slice(0, 2) : [knowledgeDocs[0]]
  const confidence = Math.min(95, 58 + sources.reduce((sum, doc) => sum + doc.score, 0) * 7)

  return {
    answer:
      sources.length > 0
        ? `The recommended approach is to follow ${sources.map((source) => source.title).join(' and ')}, collect the required context, keep sensitive data protected and route the case to the correct owner.`
        : 'The knowledge base does not have enough context. Ask for more details before taking action.',
    sources,
    confidence,
    snippets: sources.map((source) => source.content),
    limitations: 'This answer is generated from local keyword retrieval, not an external LLM.',
  }
}
