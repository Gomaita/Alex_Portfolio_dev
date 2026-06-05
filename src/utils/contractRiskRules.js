export function detectReentrancyRisk(snippet) {
  const externalCallIndex = Math.max(snippet.indexOf('.call'), snippet.indexOf('.transfer'), snippet.indexOf('.send'))
  const stateUpdateIndex = Math.max(snippet.indexOf('status ='), snippet.indexOf('balances['))
  return externalCallIndex !== -1 && stateUpdateIndex !== -1 && externalCallIndex < stateUpdateIndex
}

export function detectMissingAccessControl(snippet) {
  const sensitiveFunction = /function\s+(refund|release|withdraw|emergencyWithdraw|resolve)/i.test(snippet)
  const hasAccessControl = /only(Client|Freelancer|Arbiter|Owner)|require\(msg\.sender/i.test(snippet)
  return sensitiveFunction && !hasAccessControl
}

export function detectMissingEvents(snippet) {
  const changesState = /status\s*=|transfer|call\{value/.test(snippet)
  return changesState && !/emit\s+\w+/.test(snippet)
}

function detectHardcodedOwner(snippet) {
  return /address\s+\w+\s*=\s*0x[a-fA-F0-9]{40}/.test(snippet)
}

function detectMissingRequire(snippet) {
  return /function\s+\w+/.test(snippet) && !/require\(/.test(snippet)
}

export function getRiskSeverity(score) {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 35) return 'medium'
  return 'low'
}

export function analyzeSoliditySnippet(snippet) {
  const issues = []

  if (detectReentrancyRisk(snippet)) {
    issues.push({
      title: 'Reentrancy risk',
      severity: 'high',
      explanation: 'An external call appears before state is updated.',
      recommendation: 'Use checks-effects-interactions or a reentrancy guard.',
    })
  }

  if (detectMissingAccessControl(snippet)) {
    issues.push({
      title: 'Missing access control',
      severity: 'high',
      explanation: 'A sensitive function can be called without an obvious role check.',
      recommendation: 'Add explicit role modifiers or sender validation.',
    })
  }

  if (detectMissingEvents(snippet)) {
    issues.push({
      title: 'Missing event emission',
      severity: 'medium',
      explanation: 'The snippet changes important state or value without emitting an event.',
      recommendation: 'Emit events for important contract transitions.',
    })
  }

  if (detectHardcodedOwner(snippet)) {
    issues.push({
      title: 'Hardcoded privileged address',
      severity: 'medium',
      explanation: 'A privileged address is hardcoded in the contract snippet.',
      recommendation: 'Use constructor parameters and clear ownership transfer rules.',
    })
  }

  if (detectMissingRequire(snippet)) {
    issues.push({
      title: 'Missing require checks',
      severity: 'medium',
      explanation: 'The function does not show obvious precondition checks.',
      recommendation: 'Validate state, role and amounts before changing contract data.',
    })
  }

  const score = Math.min(100, issues.reduce((sum, issue) => {
    if (issue.severity === 'high') return sum + 32
    if (issue.severity === 'medium') return sum + 18
    return sum + 8
  }, 8))

  return {
    riskScore: score,
    severity: getRiskSeverity(score),
    detectedIssues: issues,
    recommendations: issues.map((issue) => issue.recommendation),
    safePatterns: [
      'Explicit state checks',
      'Role-based permissions',
      'Events for important transitions',
      'Checks before value transfers',
    ],
  }
}
