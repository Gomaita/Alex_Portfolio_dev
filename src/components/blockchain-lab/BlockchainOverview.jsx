import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { states } from '../../data/blockchainLabData'
import BlockchainMetricCard from './BlockchainMetricCard'
import RiskScoreCard from './RiskScoreCard'

const stateColors = ['#8b5cf6', '#06b6d4', '#22c55e', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#f97316', '#64748b']

function BlockchainOverview({ agreement, transactions, milestones, dispute }) {
  const stateData = states.slice(0, 7).map((state, index) => ({
    name: state.id,
    value: state.id === agreement.currentStatus ? 3 : index % 2 === 0 ? 1 : 2,
  }))

  const milestoneData = milestones.map((milestone) => ({
    name: milestone.title,
    percent: milestone.percent,
  }))

  const activityData = transactions.map((transaction, index) => ({
    label: transaction.timestamp,
    events: index + 1,
    value: Number.parseFloat(transaction.amount) || index + 1,
  }))

  const completedMilestones = milestones.filter((milestone) => milestone.status === 'Released').length
  const openDisputes = agreement.currentStatus === 'Disputed' ? 1 : 0

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-violet-300/15 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.22),transparent_34%),linear-gradient(135deg,#11112a,#151633)] p-6 shadow-2xl shadow-violet-950/20">
        <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-200">
          Contract command overview
        </span>
        <h1 className="mt-5 text-3xl font-black tracking-normal text-white sm:text-4xl">
          Simulated escrow agreement workspace
        </h1>
        <p className="mt-3 text-lg font-semibold text-violet-200">Smart contract concepts without wallets or real funds</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-indigo-200/75">
          Review agreement states, milestone payments, event logs, dispute votes and educational security notes in one Web3-style dashboard.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-bold text-violet-100">
            Contract: 0xA17...E5C0
          </span>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
            Status: {agreement.currentStatus}
          </span>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
            No wallet connected
          </span>
        </div>
        <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-indigo-200/75">
          This is an educational smart contract simulation. It does not use real wallets, real funds or a deployed blockchain contract.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BlockchainMetricCard label="Active agreements" value="3" detail="Simulated escrow cases" />
        <BlockchainMetricCard label="Simulated value locked" value={`${agreement.balanceLocked || agreement.amountEth} ETH`} detail="No real funds" tone="violet" />
        <BlockchainMetricCard label="Released payments" value={`${agreement.balanceReleased} ETH`} detail="Local state only" tone="green" />
        <BlockchainMetricCard label="Open disputes" value={openDisputes} detail="Current agreement" tone="red" />
        <RiskScoreCard score={82} />
        <BlockchainMetricCard label="Events emitted" value={transactions.length} detail="Simulated event log" tone="cyan" />
        <BlockchainMetricCard label="Milestones completed" value={`${completedMilestones}/${milestones.length}`} detail="Vesting schedule" tone="amber" />
        <BlockchainMetricCard label="Governance quorum" value={`${dispute.options.reduce((sum, option) => sum + option.votes, 0)}/${dispute.quorumRequired}`} detail="DAO-style vote" tone="violet" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
          <h2 className="font-bold text-white">Agreement states</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stateData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={88} paddingAngle={3}>
                  {stateData.map((entry, index) => <Cell key={entry.name} fill={stateColors[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
          <h2 className="font-bold text-white">Milestone distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={milestoneData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="percent" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
          <h2 className="font-bold text-white">Contract activity</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="events" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <h2 className="font-bold text-white">Key learning points</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            'Escrow contracts lock funds until conditions are met.',
            'Smart contracts need strict role permissions.',
            'State transitions should be explicit.',
            'Dispute resolution should be planned before funds are released.',
            'Not all application data belongs on-chain.',
          ].map((point) => (
            <p key={point} className="rounded-2xl border border-violet-300/10 bg-[#080b1f]/80 p-4 text-sm leading-6 text-indigo-200/75">{point}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlockchainOverview
