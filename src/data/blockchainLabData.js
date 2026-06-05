export const roles = ['Client', 'Freelancer', 'Arbiter']

export const states = [
  { id: 'Created', description: 'Agreement exists but no funds are locked yet.', next: ['Funded', 'Cancelled'], triggers: ['Client'] },
  { id: 'Funded', description: 'Funds are locked in escrow. The freelancer can accept the agreement.', next: ['Accepted', 'Disputed'], triggers: ['Freelancer', 'Client'] },
  { id: 'Accepted', description: 'The freelancer accepted the work and can start delivery.', next: ['In Progress', 'Delivered', 'Disputed'], triggers: ['Freelancer', 'Client'] },
  { id: 'In Progress', description: 'Work is active. Delivery or dispute can happen next.', next: ['Delivered', 'Disputed'], triggers: ['Freelancer', 'Client'] },
  { id: 'Delivered', description: 'Work is marked as delivered. The client can release funds or open a dispute.', next: ['Released', 'Disputed'], triggers: ['Client'] },
  { id: 'Released', description: 'Funds were released to the freelancer. This is a final state.', next: [], triggers: [] },
  { id: 'Disputed', description: 'The agreement is paused for arbiter review.', next: ['Released', 'Refunded'], triggers: ['Arbiter'] },
  { id: 'Refunded', description: 'Funds were returned to the client. This is a final state.', next: [], triggers: [] },
  { id: 'Cancelled', description: 'Agreement was cancelled before funding. This is a final state.', next: [], triggers: [] },
]

export const initialMilestones = [
  { id: 'design', title: 'Design prototype', percent: 30, amountEth: 2.25, status: 'Claimable', dueDate: '2026-06-12' },
  { id: 'first-delivery', title: 'First delivery', percent: 40, amountEth: 3, status: 'Locked', dueDate: '2026-06-22' },
  { id: 'final-delivery', title: 'Final delivery', percent: 30, amountEth: 2.25, status: 'Locked', dueDate: '2026-07-02' },
]

export const initialAgreement = {
  agreementTitle: 'Portfolio Security Dashboard Build',
  clientAddress: '0xC1ient000000000000000000000000000000000',
  freelancerAddress: '0xFreelancer0000000000000000000000000000',
  arbiterAddress: '0xArbiter000000000000000000000000000000',
  contractAddress: '0xEscrow00000000000000000000000000000000',
  amountEth: 7.5,
  currentStatus: 'Created',
  createdAt: '2026-06-05',
  deadline: '2026-07-05',
  milestones: initialMilestones,
  balanceLocked: 0,
  balanceReleased: 0,
}

export const sampleTransactions = [
  {
    id: 'tx-001',
    eventName: 'EscrowCreated',
    role: 'Client',
    from: '0xC1ient...0000',
    to: '0xEscrow...0000',
    amount: '0 ETH',
    fakeTxHash: '0x9a2f3c4b5d6e7f8091a2b3c4d5e6f7089a1b2c3d',
    timestamp: '10:00:12',
    status: 'confirmed',
    description: 'Simulated escrow agreement created.',
  },
]

export const disputeProposal = {
  title: 'Resolve escrow dispute',
  quorumRequired: 5,
  deadline: '2026-06-20',
  executionStatus: 'Waiting for quorum',
  options: [
    { id: 'release', label: 'Release funds to freelancer', votes: 2 },
    { id: 'refund', label: 'Refund client', votes: 1 },
    { id: 'extend', label: 'Extend review', votes: 1 },
  ],
}

export const permissionMatrix = [
  ['Create agreement', true, false, false],
  ['Fund escrow', true, false, false],
  ['Accept agreement', false, true, false],
  ['Mark delivered', false, true, false],
  ['Release payment', true, false, false],
  ['Open dispute', true, true, false],
  ['Resolve dispute', false, false, true],
  ['Refund client', false, false, true],
]

export const onChainOffChainItems = {
  onChain: ['Agreement status', 'Escrow balance', 'Role addresses', 'Payment release', 'Events', 'Dispute result'],
  offChain: ['Project files', 'Chat messages', 'Long descriptions', 'Attachments', 'Private notes', 'UI preferences'],
}

export const soliditySnippets = [
  {
    id: 'state',
    label: 'State enum',
    code: `enum Status {
    Created,
    Funded,
    Accepted,
    Delivered,
    Released,
    Disputed,
    Refunded
}`,
    explanation: 'The contract state should be explicit so each action can validate the current step.',
    note: 'Simplified Solidity for learning purposes.',
  },
  {
    id: 'access',
    label: 'Access control',
    code: `modifier onlyClient() {
    require(msg.sender == client, "Only client");
    _;
}

modifier onlyArbiter() {
    require(msg.sender == arbiter, "Only arbiter");
    _;
}`,
    explanation: 'Sensitive actions need role checks so the wrong account cannot release or refund funds.',
    note: 'Real contracts should review ownership transfer and emergency procedures carefully.',
  },
  {
    id: 'fund',
    label: 'fundEscrow()',
    code: `function fundEscrow() external payable onlyClient {
    require(status == Status.Created, "Invalid state");
    require(msg.value == amount, "Wrong amount");
    status = Status.Funded;
    emit EscrowFunded(msg.sender, msg.value);
}`,
    explanation: 'The client locks the agreed value before the freelancer accepts the work.',
    note: 'Real contracts should define what happens if too much or too little value is sent.',
  },
  {
    id: 'deliver',
    label: 'markDelivered()',
    code: `function markDelivered() external onlyFreelancer {
    require(status == Status.Accepted, "Not accepted");
    status = Status.Delivered;
    emit WorkDelivered(freelancer);
}`,
    explanation: 'The freelancer can mark work delivered only after accepting the funded agreement.',
    note: 'Delivery evidence usually belongs off-chain, while the state change can be on-chain.',
  },
  {
    id: 'release',
    label: 'releasePayment()',
    code: `function releasePayment() external onlyClient {
    require(status == Status.Delivered, "Work not delivered");
    status = Status.Released;
    emit PaymentReleased(freelancer, address(this).balance);
    payable(freelancer).transfer(address(this).balance);
}`,
    explanation: 'This function only allows the client to release funds after delivery.',
    note: 'In a real contract, transfer patterns and reentrancy protection should be reviewed carefully.',
  },
  {
    id: 'dispute',
    label: 'openDispute()',
    code: `function openDispute() external {
    require(msg.sender == client || msg.sender == freelancer, "Invalid role");
    require(status == Status.Funded || status == Status.Delivered, "Invalid state");
    status = Status.Disputed;
    emit DisputeOpened(msg.sender);
}`,
    explanation: 'Either participant can pause the flow before funds are released.',
    note: 'A real dispute process needs clear evidence handling and privacy rules.',
  },
  {
    id: 'resolve',
    label: 'resolveDispute()',
    code: `function resolveDispute(bool releaseToFreelancer) external onlyArbiter {
    require(status == Status.Disputed, "No dispute");
    status = releaseToFreelancer ? Status.Released : Status.Refunded;
    emit DisputeResolved(releaseToFreelancer);
}`,
    explanation: 'The arbiter can resolve a disputed escrow by releasing or refunding funds.',
    note: 'A real contract should document arbiter powers and review centralization risk.',
  },
  {
    id: 'events',
    label: 'events',
    code: `event EscrowFunded(address indexed client, uint256 amount);
event WorkDelivered(address indexed freelancer);
event PaymentReleased(address indexed freelancer, uint256 amount);
event DisputeOpened(address indexed openedBy);
event DisputeResolved(bool releaseToFreelancer);`,
    explanation: 'Events make important state transitions easier to index and review.',
    note: 'Avoid emitting private information in public event logs.',
  },
]

export const riskExamples = [
  {
    id: 'safe-release',
    label: 'Safe escrow release',
    snippet: `function releasePayment() external onlyClient {
    require(status == Status.Delivered, "Work not delivered");
    status = Status.Released;
    emit PaymentReleased(freelancer, balance);
    payable(freelancer).transfer(balance);
}`,
  },
  {
    id: 'reentrancy',
    label: 'Reentrancy-prone withdraw',
    snippet: `function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool ok,) = msg.sender.call{value: amount}("");
    require(ok);
    balances[msg.sender] = 0;
}`,
  },
  {
    id: 'missing-access',
    label: 'Missing access control',
    snippet: `function refundClient() external {
    status = Status.Refunded;
    payable(client).transfer(address(this).balance);
}`,
  },
  {
    id: 'missing-events',
    label: 'Missing event emission',
    snippet: `function markDelivered() external onlyFreelancer {
    require(status == Status.Accepted);
    status = Status.Delivered;
}`,
  },
  {
    id: 'hardcoded-owner',
    label: 'Hardcoded owner',
    snippet: `address owner = 0x1234567890123456789012345678901234567890;

function emergencyWithdraw() external {
    require(msg.sender == owner);
    payable(owner).transfer(address(this).balance);
}`,
  },
  {
    id: 'state-after-transfer',
    label: 'State update after transfer',
    snippet: `function release() external onlyClient {
    payable(freelancer).transfer(address(this).balance);
    status = Status.Released;
}`,
  },
]
