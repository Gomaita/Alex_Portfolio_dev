import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function DisputeVote({ proposal, selectedVote, onSelectVote, onSubmitVote, onExecuteVote }) {
  const totalVotes = proposal.options.reduce((sum, option) => sum + option.votes, 0)
  const leading = [...proposal.options].sort((a, b) => b.votes - a.votes)[0]
  const quorumReached = totalVotes >= proposal.quorumRequired

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <h1 className="text-2xl font-bold text-white">DAO-style Dispute Vote</h1>
        <p className="mt-2 text-sm text-indigo-200/70">This module simulates governance-style decision making for disputed escrow agreements.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
          <h2 className="font-bold text-white">{proposal.title}</h2>
          <p className="mt-2 text-sm text-indigo-200/70">Deadline: {proposal.deadline}</p>
          <p className="mt-2 text-sm text-indigo-200/70">Quorum: {totalVotes}/{proposal.quorumRequired}</p>

          <div className="mt-5 grid gap-3">
            {proposal.options.map((option) => (
              <button key={option.id} type="button" onClick={() => onSelectVote(option.id)} className={`rounded-2xl border p-4 text-left transition ${selectedVote === option.id ? 'border-violet-300 bg-violet-400/18 text-violet-100' : 'border-violet-300/10 bg-[#080b1f]/85 text-indigo-200/75 hover:border-violet-300/35'}`}>
                <span className="font-semibold">{option.label}</span>
                <span className="mt-1 block text-sm text-slate-500">{option.votes} votes</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={onSubmitVote} className="min-h-11 rounded-lg bg-violet-500 px-4 py-2 text-sm font-bold text-white hover:bg-violet-400">
              Submit simulated vote
            </button>
            <button type="button" onClick={onExecuteVote} disabled={!quorumReached} className="min-h-11 rounded-lg border border-violet-300/20 px-4 py-2 text-sm font-bold text-violet-100 disabled:opacity-50">
              Execute result
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
          <h2 className="font-bold text-white">Vote distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proposal.options}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="votes" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 rounded-2xl border border-violet-300/12 bg-[#080b1f]/85 p-4">
            <p className="font-semibold text-white">Current result</p>
            <p className="mt-2 text-sm text-indigo-200/75">{leading.label}</p>
            <p className="mt-1 text-sm text-indigo-200/50">{quorumReached ? 'Quorum reached' : 'Waiting for quorum'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisputeVote
