import { categoryDistribution } from './classificationEngine'

export function generateExecutiveReport({ tickets, cleaning, review, agent, evaluation }) {
  const distribution = categoryDistribution(tickets)
  const topCategories = Object.entries(distribution).sort((a, b) => b[1] - a[1])
  const highPriority = tickets.filter((ticket) => ['High', 'Critical'].includes(ticket.priority))
  const sentimentOverview = tickets.reduce((acc, ticket) => {
    acc[ticket.sentiment] = (acc[ticket.sentiment] || 0) + 1
    return acc
  }, {})

  return {
    reportStatus: 'ready',
    generatedAt: new Date().toISOString(),
    executiveSummary: `Analyzed ${tickets.length} support tickets. The leading issue area is ${topCategories[0]?.[0] || 'Unknown'} with ${highPriority.length} high-impact cases.`,
    totalTicketsAnalyzed: tickets.length,
    mainIncidentDetected: highPriority[0]?.summary || 'No critical incident detected.',
    topCategories,
    highPriorityIssues: highPriority.map((ticket) => ticket.id),
    sentimentOverview,
    privacyActionsPerformed: cleaning?.stats?.privacy || { names: 0, emails: 0, phones: 0 },
    humanReviewSummary: review,
    agentRecommendations: agent?.output?.recommendedActions || [],
    suggestedNextSteps: [
      'Review unresolved low-confidence tickets.',
      'Escalate critical production blockers.',
      'Monitor billing dispute trend over the next cycle.',
    ],
    suggestedCustomerResponse:
      agent?.output?.draftMessage || 'Thanks for contacting support. We have categorized your request and will follow up with the correct owner.',
    evaluationScore: evaluation?.metrics?.safetyScore || null,
  }
}
