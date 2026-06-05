const adminMutationMethods = new Set(['POST', 'PATCH', 'DELETE'])
const publicRoutes = new Set(['/', '/portfolio', '/about', '/contact', '/cheatsheets'])

export function normalizeRequestInput(request) {
  return {
    method: String(request.method || 'GET').toUpperCase(),
    path: String(request.path || '/').trim() || '/',
    sourceIp: String(request.sourceIp || '192.0.2.10').trim(),
    port: Number(request.port || 443),
    protocol: String(request.protocol || 'HTTPS').toUpperCase(),
    payload: String(request.payload || ''),
    hasAdminToken: Boolean(request.hasAdminToken),
    repeatedContact: Boolean(request.repeatedContact),
    unusualVolume: Boolean(request.unusualVolume),
  }
}

export function detectSuspiciousPayload(payload) {
  const normalized = String(payload || '').toLowerCase()
  const scriptLike = normalized.includes('<script') || normalized.includes('javascript:')
  const sqlLike = /\b(select|drop|union|insert|delete|update)\b/.test(normalized) || normalized.includes('or 1=1')

  return {
    isSuspicious: scriptLike || sqlLike,
    reasons: [
      scriptLike ? 'script-like input' : '',
      sqlLike ? 'SQL-like input' : '',
    ].filter(Boolean),
  }
}

export function isPrivateIp(ip) {
  const value = String(ip || '')
  return (
    value.startsWith('10.') ||
    value.startsWith('192.168.') ||
    value.startsWith('127.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(value)
  )
}

function ruleMatches(rule, request) {
  const suspiciousPayload = detectSuspiciousPayload(request.payload)

  switch (rule.conditionType) {
    case 'adminWithoutToken':
      return request.path.startsWith('/api/admin') && !request.hasAdminToken
    case 'adminMutationWithoutToken':
      return request.path.startsWith('/api/admin') && adminMutationMethods.has(request.method) && !request.hasAdminToken
    case 'suspiciousPayload':
      return request.path === '/api/contact' && suspiciousPayload.isSuspicious
    case 'oversizedPayload':
      return ['POST', 'PATCH'].includes(request.method) && request.payload.length > 2000
    case 'repeatedContact':
      return request.path === '/api/contact' && request.repeatedContact
    case 'publicRoute':
      return request.method === 'GET' && publicRoutes.has(request.path)
    case 'metricsRoute':
      return request.method === 'GET' && request.path === '/api/metrics'
    case 'privateIp':
      return isPrivateIp(request.sourceIp)
    case 'unusualVolume':
      return request.unusualVolume
    default:
      return false
  }
}

export function calculateRiskScore(triggeredRules, request) {
  const baseScore = request.protocol === 'HTTP' ? 12 : 4
  const payloadScore = Math.min(18, Math.floor(request.payload.length / 160))
  const ruleScore = triggeredRules.reduce((highest, rule) => Math.max(highest, rule.riskWeight || 0), 0)
  return Math.min(100, Math.max(baseScore + payloadScore, ruleScore))
}

export function getSeverityFromScore(score) {
  if (score >= 90) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

export function getDecisionFromRules(triggeredRules, score) {
  if (triggeredRules.some((rule) => rule.action === 'block')) return 'blocked'
  if (triggeredRules.some((rule) => rule.action === 'flag') || score >= 40) return 'flagged'
  return 'allowed'
}

export function evaluateRequest(requestInput, rules) {
  const request = normalizeRequestInput(requestInput)
  const enabledRules = rules.filter((rule) => rule.enabled)
  const triggeredRules = enabledRules
    .filter((rule) => ruleMatches(rule, request))
    .sort((a, b) => a.priority - b.priority)

  const score = calculateRiskScore(triggeredRules, request)
  const severity = getSeverityFromScore(score)
  const decision = getDecisionFromRules(triggeredRules, score)

  const matchedRules = triggeredRules.length
    ? triggeredRules
    : enabledRules.filter((rule) => rule.conditionType === 'publicRoute' && request.method === 'GET' && publicRoutes.has(request.path))

  const recommendation = getRecommendation(decision, severity, matchedRules)

  return {
    request,
    decision,
    riskScore: score,
    severity,
    matchedRules,
    recommendation,
    timeline: [
      'Request received',
      'Input normalized',
      'Firewall rules evaluated',
      'Risk score calculated',
      'Decision applied',
    ],
  }
}

function getRecommendation(decision, severity, matchedRules) {
  if (decision === 'blocked') {
    return 'Block the request and review whether the same source repeats the pattern.'
  }

  if (decision === 'flagged' || ['high', 'critical'].includes(severity)) {
    return 'Flag the request for incident review and keep sensitive data out of logs.'
  }

  if (matchedRules.some((rule) => rule.action === 'allow')) {
    return 'Allow the request and keep monitoring aggregate patterns.'
  }

  return 'No major risk detected in this simulated request.'
}
