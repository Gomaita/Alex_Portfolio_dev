import { getCategoryDistribution } from './classificationEngine'

export function generateReport(tickets) {
  const distribution = getCategoryDistribution(tickets)
  const commonCategory = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General Question'
  const highPriority = tickets.filter((ticket) => ticket.priority === 'High')
  const sentiment = tickets.reduce((acc, ticket) => {
    acc[ticket.sentiment] = (acc[ticket.sentiment] || 0) + 1
    return acc
  }, {})

  return {
    generatedAt: new Date().toISOString(),
    totalTickets: tickets.length,
    mainIssueDetected: highPriority[0]?.summary || 'No high priority issue detected.',
    mostCommonCategory: commonCategory,
    sentimentOverview: sentiment,
    recommendedActions: [
      `Prioritize ${highPriority.length} high priority ticket${highPriority.length === 1 ? '' : 's'}.`,
      `Prepare support macros for ${commonCategory}.`,
      'Review failed or warning evaluation cases before connecting a real model.',
    ],
    suggestedSupportResponse:
      'Thanks for the detailed report. We have categorized your request, assigned the right priority and will follow up with the next action based on the support policy.',
  }
}
