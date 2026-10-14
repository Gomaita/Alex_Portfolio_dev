export async function analyzeMessage({ message, messageType = 'auto', signal }) {
  const controller = new AbortController()
  const cancel = () => controller.abort()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener('abort', cancel, { once: true })
  const timeout = setTimeout(cancel, 25000)
  try {
    const response = await fetch('/api/ai-message-processor', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, messageType }), signal: controller.signal,
    })
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('The analysis backend is unavailable. Please try again later.')
    }
    const data = await response.json().catch(() => null)
    if (!response.ok || data?.ok !== true) throw new Error(data?.error || 'The message could not be analyzed. Please try again.')
    const result = data.result
    if (!result || typeof data.demoMode !== 'boolean' || typeof result.summary !== 'string' || !result.summary.trim() || typeof result.suggestedReply !== 'string'
      || typeof result.category !== 'string' || typeof result.confidence !== 'number'
      || !Number.isFinite(result.confidence) || result.confidence < 0 || result.confidence > 1
      || !['email', 'chat_message', 'support_ticket', 'client_request', 'recruiter_message', 'internal_task', 'unknown'].includes(result.messageType)
      || typeof result.requiresFollowUp !== 'boolean' || !(result.deadline === null || typeof result.deadline === 'string')
      || !Array.isArray(result.tasks) || result.tasks.length > 12 || result.tasks.some((task) => !task || typeof task.title !== 'string'
        || !(task.owner === null || typeof task.owner === 'string') || !(task.dueDate === null || typeof task.dueDate === 'string'))
      || !['low', 'medium', 'high', 'urgent'].includes(result.priority)
      || !['positive', 'neutral', 'negative', 'mixed'].includes(result.sentiment)) {
      throw new Error('The backend returned an invalid analysis. Please try again.')
    }
    return data
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Analysis timed out or was cancelled. Please try again.')
    if (error instanceof TypeError) throw new Error('Could not reach the analysis backend. Check your connection and try again.')
    throw error
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', cancel)
  }
}
