import { categoryDistribution } from './classificationEngine'

export const agentTasks = [
  'Find most repeated issues',
  'Generate support summary',
  'Create action plan',
  'Draft customer response',
  'Detect urgent incidents',
  'Prepare manager briefing',
]

export const agentTimeline = [
  'Understanding task',
  'Selecting tools',
  'Searching dataset',
  'Grouping issues',
  'Calculating impact',
  'Generating recommendation',
  'Validating output',
]

export function runAgent(task, tickets) {
  const distribution = categoryDistribution(tickets)
  const topCategory = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General Question'
  const urgent = tickets.filter((ticket) => ['High', 'Critical'].includes(ticket.priority))
  const review = tickets.filter((ticket) => ticket.needsReview)
  const toolCalls = [
    makeTool('searchTickets()', `${tickets.length} records`, `${urgent.length} urgent candidates found`, 82),
    makeTool('filterByPriority()', 'priority >= High', `${urgent.length} tickets returned`, 49),
    makeTool('groupBySimilarity()', 'message + category', `${Object.keys(distribution).length} clusters`, 117),
    makeTool('detectRecurringIssues()', 'clustered tickets', `${topCategory} is the largest group`, 76),
    makeTool('calculateBusinessImpact()', 'priority + sentiment', urgent.length ? 'Elevated support risk' : 'Normal load', 63),
    makeTool('generateRecommendation()', 'policy + dataset', 'Action plan drafted', 105),
    makeTool('validateAgentOutput()', 'assumptions + evidence', review.length ? 'Warnings included' : 'Passed', 58),
  ]

  return {
    task,
    timeline: agentTimeline,
    toolCalls,
    output: {
      mainFinding: buildFinding(task, topCategory, urgent.length),
      businessImpact: urgent.length ? 'High priority issues can increase churn risk if not triaged quickly.' : 'Current workload can be handled with normal support routing.',
      recommendedActions: [
        `Prioritize ${urgent.length} urgent ticket${urgent.length === 1 ? '' : 's'}.`,
        `Prepare macros for ${topCategory}.`,
        'Keep low-confidence predictions in the human review queue.',
      ],
      draftMessage:
        'Thanks for sharing the details. We have categorized your request, assigned the correct priority and will follow up with the next action after the support owner validates the case.',
      confidence: Math.min(94, 78 + Math.max(0, urgent.length - review.length)),
      risks: review.length ? ['Some low-confidence tickets still require human review.', 'Agent recommendations are based on mock local rules.'] : ['No major unresolved review risks detected.'],
    },
  }
}

function makeTool(name, input, output, duration) {
  return { name, input, output, duration, status: 'completed' }
}

function buildFinding(task, topCategory, urgentCount) {
  if (task === 'Detect urgent incidents') return `${urgentCount} urgent incidents require escalation review.`
  if (task === 'Draft customer response') return `Draft response prepared using ${topCategory.toLowerCase()} context.`
  if (task === 'Prepare manager briefing') return `Manager briefing focused on ${topCategory} and ${urgentCount} urgent cases.`
  return `The most repeated issue area is ${topCategory}.`
}
