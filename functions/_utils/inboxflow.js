export const messageTypes = ['email', 'chat_message', 'support_ticket', 'client_request', 'recruiter_message', 'internal_task', 'unknown']
export const inputTypes = ['auto', 'email', 'chat', 'support_ticket', 'client_request', 'recruiter_message', 'internal_task']

const nullableText = { type: ['string', 'null'] }
export const resultSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    messageType: { type: 'string', enum: messageTypes },
    category: { type: 'string' },
    priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
    sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative', 'mixed'] },
    summary: { type: 'string' }, deadline: nullableText,
    tasks: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: { title: { type: 'string' }, owner: nullableText, dueDate: nullableText },
      required: ['title', 'owner', 'dueDate'],
    } },
    suggestedReply: { type: 'string' }, confidence: { type: 'number', minimum: 0, maximum: 1 },
    requiresFollowUp: { type: 'boolean' },
  },
  required: ['messageType', 'category', 'priority', 'sentiment', 'summary', 'deadline', 'tasks', 'suggestedReply', 'confidence', 'requiresFollowUp'],
}

export function validateResult(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid result')
  const text = (item, max) => typeof item === 'string' && item.trim().length > 0 && item.length <= max
  const optional = (item) => item === null || text(item, 300)
  if (!messageTypes.includes(value.messageType) || !['low', 'medium', 'high', 'urgent'].includes(value.priority)
    || !['positive', 'neutral', 'negative', 'mixed'].includes(value.sentiment)
    || !text(value.category, 120) || !text(value.summary, 2000) || !text(value.suggestedReply, 3000)
    || !optional(value.deadline) || typeof value.confidence !== 'number' || !Number.isFinite(value.confidence)
    || value.confidence < 0 || value.confidence > 1 || typeof value.requiresFollowUp !== 'boolean'
    || !Array.isArray(value.tasks) || value.tasks.length > 12
    || value.tasks.some((task) => !task || !text(task.title, 500) || !optional(task.owner) || !optional(task.dueDate))) {
    throw new Error('Invalid result schema')
  }
  // Reconstruct the contract so unexpected model fields never reach the client.
  return Object.fromEntries(Object.keys(resultSchema.properties).map((key) => [key,
    key === 'tasks' ? value.tasks.map(({ title, owner, dueDate }) => ({ title, owner, dueDate })) : value[key],
  ]))
}

export function parseModelResult(content) {
  if (typeof content !== 'string' || content.length > 20000) throw new Error('Invalid model output')
  const cleaned = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  return validateResult(JSON.parse(cleaned))
}

export function createDemoResult(message, selectedType = 'auto') {
  const lower = message.toLowerCase()
  let messageType = selectedType === 'chat' ? 'chat_message' : selectedType
  if (selectedType === 'auto') {
    messageType = /interview|recruit|position|hiring/.test(lower) ? 'recruiter_message'
      : /cannot access|password|bug|error|does not work|not working/.test(lower) && !/team|deployment/.test(lower) ? 'support_ticket'
        : /quote|website|proposal|client/.test(lower) ? 'client_request'
          : /please check|team|deployment|prepare.*update/.test(lower) ? 'internal_task'
            : /subject:|dear |regards/.test(lower) ? 'email' : 'unknown'
  }
  const deadlines = [...message.matchAll(/\b(?:by |before |on )?(?:tomorrow(?: morning| afternoon| evening)?|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(?: morning| afternoon| evening)?|next week|\d{4}-\d{2}-\d{2})\b/gi)].map((match) => match[0])
  const deadline = deadlines.length ? [...new Set(deadlines)].join('; ') : null
  const priority = /no rush|not urgent/.test(lower) ? 'low'
    : /\burgent\b|\basap\b|as soon as possible|immediately/.test(lower) ? 'urgent'
    : /tomorrow|before friday|deadline|cannot access/.test(lower) ? 'high'
      : /no rush|whenever|not urgent/.test(lower) ? 'low' : 'medium'
  const positive = /thank|great|happy|love/.test(lower)
  const negative = /frustrat|angry|terrible|disappoint|does not work|cannot access/.test(lower)
  const sentiment = positive && negative ? 'mixed' : negative ? 'negative' : positive ? 'positive' : 'neutral'
  const category = { support_ticket: 'Technical support', recruiter_message: 'Recruitment', client_request: 'Project inquiry', internal_task: 'Internal operations', email: 'Email request', chat_message: 'Chat request', unknown: 'General message' }[messageType]
  const owner = message.match(/^(?:hi|hello|hey|dear)\s+([A-Z][a-z]+)\b/)?.[1] || null
  const tasks = []
  const add = (title, dueDate = deadlines.length === 1 ? deadline : null) => tasks.push({ title, owner, dueDate })
  if (/quote|proposal/.test(lower)) add('Prepare the requested quote', /quote[^.!?]*tomorrow/i.test(message) ? 'tomorrow' : deadlines.length === 1 ? deadline : null)
  if (/3d portfolio/.test(lower)) add('Evaluate the requested 3D portfolio section')
  if (/cannot access|password|reset/.test(lower)) add('Investigate account access and the password reset link')
  if (/interview/.test(lower)) add('Confirm availability for the technical interview')
  if (/contact form/.test(lower)) add('Check the contact form bug')
  if (/deployment/.test(lower)) add('Review the deployment')
  if (/update.*team|team.*update/.test(lower)) add('Prepare a short team update')
  if (!tasks.length) {
    const request = message.split(/\n|[.!?]\s/).find((line) => /please|could you|can you|need|send|review|prepare/i.test(line))
    if (request) add(request.trim().slice(0, 240))
  }
  const replies = {
    support_ticket: 'Thanks for reporting this. I will review the issue. Could you share the exact error and the steps you have already tried, without passwords or other sensitive information?',
    recruiter_message: 'Thank you for reaching out. I would be happy to discuss the opportunity. Could you confirm the proposed interview time and format?',
    client_request: 'Thanks for your message. I will review the requested scope and timing before confirming a quote and delivery schedule.',
    internal_task: 'Thanks, I have noted the requested work. I will review the items and share an update, including any blockers.',
  }
  return validateResult({
    messageType, category, priority, sentiment,
    summary: message.replace(/\s+/g, ' ').trim().slice(0, 360), deadline, tasks,
    suggestedReply: replies[messageType] || 'Thank you for your message. I will review the details. Could you confirm any required next steps or timing?',
    confidence: messageType === 'unknown' ? 0.45 : selectedType === 'auto' ? 0.72 : 0.8,
    requiresFollowUp: tasks.length > 0 || /\?/.test(message),
  })
}
