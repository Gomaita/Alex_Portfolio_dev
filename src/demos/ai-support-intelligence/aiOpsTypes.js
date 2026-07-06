export const pipelineStages = [
  ['datasetLoaded', 'Dataset loaded'],
  ['cleaningCompleted', 'Cleaned'],
  ['classificationCompleted', 'Classified'],
  ['reviewCompleted', 'Reviewed'],
  ['agentCompleted', 'Agent run'],
  ['evaluationCompleted', 'Evaluated'],
  ['reportGenerated', 'Report generated'],
]

export const categories = [
  'Technical Support',
  'Billing',
  'Bug Report',
  'Sales',
  'Account Access',
  'General Question',
]

export const priorities = ['Low', 'Medium', 'High', 'Critical']
export const sentiments = ['Positive', 'Neutral', 'Negative']

export function createLog(module, message, type = 'info') {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    module,
    type,
    message,
  }
}
