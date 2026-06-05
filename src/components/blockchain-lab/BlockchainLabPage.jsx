import { Boxes, Code2, FileText, GitBranch, LayoutDashboard, Scale, ShieldAlert, Timer, Vote } from 'lucide-react'
import { useMemo, useState } from 'react'
import { disputeProposal, initialAgreement, initialMilestones, sampleTransactions } from '../../data/blockchainLabData'
import { applyEscrowAction, createSimulatedTransaction } from '../../utils/escrowStateMachine'
import BlockchainOverview from './BlockchainOverview'
import BlockchainSecurityNotes from './BlockchainSecurityNotes'
import BlockchainShell from './BlockchainShell'
import ContractRiskAnalyzer from './ContractRiskAnalyzer'
import ContractStateMachine from './ContractStateMachine'
import DisputeVote from './DisputeVote'
import EscrowSimulator from './EscrowSimulator'
import SolidityPreview from './SolidityPreview'
import TransactionLog from './TransactionLog'
import VestingSchedule from './VestingSchedule'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'escrow', label: 'Escrow Simulator', icon: Boxes },
  { id: 'state', label: 'State Machine', icon: GitBranch },
  { id: 'transactions', label: 'Transactions', icon: FileText },
  { id: 'code', label: 'Contract Code', icon: Code2 },
  { id: 'risk', label: 'Risk Analyzer', icon: ShieldAlert },
  { id: 'vote', label: 'Dispute Vote', icon: Vote },
  { id: 'vesting', label: 'Vesting Schedule', icon: Timer },
  { id: 'security', label: 'Security Notes', icon: Scale },
]

function BlockchainLabPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [role, setRole] = useState('Client')
  const [agreement, setAgreement] = useState(initialAgreement)
  const [milestones, setMilestones] = useState(initialMilestones)
  const [transactions, setTransactions] = useState(sampleTransactions)
  const [securityNote, setSecurityNote] = useState('')
  const [proposal, setProposal] = useState(disputeProposal)
  const [selectedVote, setSelectedVote] = useState(disputeProposal.options[0].id)

  const content = useMemo(() => ({
    overview: <BlockchainOverview agreement={agreement} transactions={transactions} milestones={milestones} dispute={proposal} />,
    escrow: <EscrowSimulator agreement={agreement} role={role} onRoleChange={setRole} onAction={handleEscrowAction} onReset={resetEscrow} securityNote={securityNote} />,
    state: <ContractStateMachine status={agreement.currentStatus} />,
    transactions: <TransactionLog transactions={transactions} />,
    code: <SolidityPreview />,
    risk: <ContractRiskAnalyzer />,
    vote: <DisputeVote proposal={proposal} selectedVote={selectedVote} onSelectVote={setSelectedVote} onSubmitVote={submitVote} onExecuteVote={executeVote} />,
    vesting: <VestingSchedule milestones={milestones} onUnlockMilestone={unlockMilestone} onReleaseMilestone={releaseMilestone} onReset={resetMilestones} />,
    security: <BlockchainSecurityNotes />,
  }), [agreement, milestones, proposal, role, securityNote, selectedVote, transactions])

  function appendTransaction(transaction) {
    setTransactions((current) => [transaction, ...current])
  }

  function handleEscrowAction(action) {
    const result = applyEscrowAction(agreement, action, role)
    setAgreement(result.agreement)
    setSecurityNote(result.note)
    if (result.transaction) appendTransaction(result.transaction)
  }

  function resetEscrow() {
    setAgreement(initialAgreement)
    setMilestones(initialMilestones)
    setTransactions(sampleTransactions)
    setSecurityNote('Simulation reset. No real contract state was changed.')
  }

  function submitVote() {
    setProposal((current) => ({
      ...current,
      options: current.options.map((option) => option.id === selectedVote ? { ...option, votes: option.votes + 1 } : option),
      executionStatus: 'Vote submitted',
    }))
    appendTransaction(createSimulatedTransaction('VoteSubmitted', 'DAO reviewer', { description: 'Simulated dispute vote submitted.' }))
  }

  function executeVote() {
    const totalVotes = proposal.options.reduce((sum, option) => sum + option.votes, 0)
    if (totalVotes < proposal.quorumRequired) return
    setProposal((current) => ({ ...current, executionStatus: 'Executed' }))
    appendTransaction(createSimulatedTransaction('DisputeResolved', 'DAO reviewers', { description: 'Simulated vote result executed.' }))
  }

  function unlockMilestone(milestoneId) {
    setMilestones((current) => current.map((milestone) => milestone.id === milestoneId ? { ...milestone, status: 'Claimable' } : milestone))
    appendTransaction(createSimulatedTransaction('MilestoneUnlocked', 'Client', { description: 'Simulated milestone marked claimable.' }))
  }

  function releaseMilestone(milestoneId) {
    const milestone = milestones.find((item) => item.id === milestoneId)
    setMilestones((current) => current.map((item) => item.id === milestoneId ? { ...item, status: 'Released' } : item))
    appendTransaction(createSimulatedTransaction('MilestoneReleased', 'Client', { amount: `${milestone?.amountEth || 0} ETH`, description: 'Simulated milestone payment released.' }))
  }

  function resetMilestones() {
    setMilestones(initialMilestones)
    appendTransaction(createSimulatedTransaction('MilestoneScheduleReset', 'Client', { description: 'Simulated vesting schedule reset.' }))
  }

  return (
    <BlockchainShell activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs}>
      {content[activeTab]}
    </BlockchainShell>
  )
}

export default BlockchainLabPage
