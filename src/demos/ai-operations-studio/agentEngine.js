import { getCategoryDistribution } from './classificationEngine'

export const agentTasks = [
  'Find most repeated issues',
  'Generate support summary',
  'Create action plan',
  'Draft customer response',
]

export const agentSteps = [
  'Understanding task',
  'Selecting tools',
  'Searching dataset',
  'Analyzing patterns',
  'Generating output',
  'Validating answer',
]

export function runAgentTask(task, tickets) {
  const distribution = getCategoryDistribution(tickets)
  const topCategory = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General Question'
  const highPriority = tickets.filter((ticket) => ticket.priority === 'High')
  const toolCalls = [
    'searchTickets(query)',
    'groupByCategory(tickets)',
    'calculatePriority(ticket)',
    'generateRecommendation(context)',
  ]

  const outputs = {
    'Find most repeated issues': `The most repeated issue group is ${topCategory}. ${highPriority.length} high priority tickets should be reviewed first.`,
    'Generate support summary': `Processed ${tickets.length} tickets. Main category: ${topCategory}. High priority queue: ${highPriority.length}.`,
    'Create action plan': `1. Escalate high priority bugs. 2. Route billing tickets to finance. 3. Prepare support macros for ${topCategory}.`,
    'Draft customer response': 'Thanks for the context. We are reviewing the issue, prioritizing it based on impact and will follow up with the next action as soon as the owner confirms the status.',
  }

  return {
    task,
    steps: agentSteps,
    toolCalls,
    output: outputs[task] || outputs['Generate support summary'],
    confidence: highPriority.length ? 0.88 : 0.8,
  }
}
