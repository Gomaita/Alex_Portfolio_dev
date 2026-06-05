const finalStates = new Set(['Released', 'Refunded', 'Cancelled'])

const actionRules = {
  createAgreement: { label: 'Create agreement', roles: ['Client'], from: ['Cancelled'], to: 'Created', eventName: 'EscrowCreated' },
  fundEscrow: { label: 'Fund escrow', roles: ['Client'], from: ['Created'], to: 'Funded', eventName: 'EscrowFunded' },
  acceptAgreement: { label: 'Accept agreement', roles: ['Freelancer'], from: ['Funded'], to: 'Accepted', eventName: 'AgreementAccepted' },
  startWork: { label: 'Start work', roles: ['Freelancer'], from: ['Accepted'], to: 'In Progress', eventName: 'WorkStarted' },
  markDelivered: { label: 'Mark work as delivered', roles: ['Freelancer'], from: ['Accepted', 'In Progress'], to: 'Delivered', eventName: 'WorkDelivered' },
  requestRelease: { label: 'Request release', roles: ['Freelancer'], from: ['Delivered'], to: 'Delivered', eventName: 'ReleaseRequested' },
  approveDelivery: { label: 'Approve delivery and release', roles: ['Client'], from: ['Delivered'], to: 'Released', eventName: 'PaymentReleased' },
  openDispute: { label: 'Open dispute', roles: ['Client', 'Freelancer'], from: ['Funded', 'Accepted', 'In Progress', 'Delivered'], to: 'Disputed', eventName: 'DisputeOpened' },
  cancelBeforeFunding: { label: 'Cancel before funding', roles: ['Client'], from: ['Created'], to: 'Cancelled', eventName: 'EscrowCancelled' },
  reviewDispute: { label: 'Review dispute', roles: ['Arbiter'], from: ['Disputed'], to: 'Disputed', eventName: 'DisputeReviewed' },
  releaseToFreelancer: { label: 'Release to freelancer', roles: ['Arbiter'], from: ['Disputed'], to: 'Released', eventName: 'DisputeResolved' },
  refundClient: { label: 'Refund client', roles: ['Arbiter'], from: ['Disputed'], to: 'Refunded', eventName: 'RefundIssued' },
  extendReview: { label: 'Extend review', roles: ['Arbiter'], from: ['Disputed'], to: 'Disputed', eventName: 'ReviewExtended' },
}

export function getAvailableActions(role, status) {
  return Object.entries(actionRules)
    .filter(([, rule]) => rule.roles.includes(role) && rule.from.includes(status) && !finalStates.has(status))
    .map(([id, rule]) => ({ id, ...rule }))
}

export function canRolePerformAction(role, action, status) {
  const rule = actionRules[action]
  return Boolean(rule && rule.roles.includes(role) && rule.from.includes(status) && !finalStates.has(status))
}

export function getNextStatus(action, status) {
  const rule = actionRules[action]
  if (!rule || !rule.from.includes(status)) return status
  return rule.to
}

export function generateFakeTxHash() {
  const hex = '0123456789abcdef'
  let output = '0x'
  for (let index = 0; index < 40; index += 1) {
    output += hex[Math.floor(Math.random() * hex.length)]
  }
  return output
}

export function createSimulatedTransaction(eventName, role, metadata = {}) {
  return {
    id: `tx-${Date.now()}`,
    eventName,
    role,
    from: metadata.from || role,
    to: metadata.to || 'SmartEscrow',
    amount: metadata.amount || '0 ETH',
    fakeTxHash: generateFakeTxHash(),
    timestamp: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()),
    status: metadata.status || 'confirmed',
    description: metadata.description || `${eventName} emitted by simulated ${role} action.`,
  }
}

export function applyEscrowAction(agreement, action, role) {
  if (!canRolePerformAction(role, action, agreement.currentStatus)) {
    return {
      agreement,
      transaction: null,
      note: 'This action is disabled because the selected role or contract state is not allowed.',
    }
  }

  const rule = actionRules[action]
  const nextStatus = getNextStatus(action, agreement.currentStatus)
  let nextAgreement = { ...agreement, currentStatus: nextStatus }
  let amount = '0 ETH'

  if (action === 'fundEscrow') {
    nextAgreement = { ...nextAgreement, balanceLocked: agreement.amountEth }
    amount = `${agreement.amountEth} ETH`
  }

  if (['approveDelivery', 'releaseToFreelancer'].includes(action)) {
    nextAgreement = { ...nextAgreement, balanceReleased: agreement.balanceLocked, balanceLocked: 0 }
    amount = `${agreement.balanceLocked || agreement.amountEth} ETH`
  }

  if (action === 'refundClient') {
    nextAgreement = { ...nextAgreement, balanceLocked: 0 }
    amount = `${agreement.balanceLocked || agreement.amountEth} ETH`
  }

  const transaction = createSimulatedTransaction(rule.eventName, role, {
    amount,
    description: `${rule.label} changed status from ${agreement.currentStatus} to ${nextStatus}.`,
  })

  return {
    agreement: nextAgreement,
    transaction,
    note: getSecurityNote(action, role),
  }
}

function getSecurityNote(action, role) {
  const notes = {
    fundEscrow: 'This action requires the client role and only works while the agreement is Created.',
    approveDelivery: 'This action requires the client role and only works after the work has been marked as delivered.',
    openDispute: 'Dispute resolution is restricted to the arbiter role to avoid unilateral fund release.',
    releaseToFreelancer: 'The arbiter can release funds only while the agreement is disputed.',
    refundClient: 'Refunds are restricted to the arbiter during a disputed state.',
  }

  return notes[action] || `This simulated action was executed with the ${role} role and validated against the contract state.`
}

export const escrowActionRules = actionRules
