import { RotateCcw } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const statusColors = {
  Locked: '#64748b',
  Claimable: '#f59e0b',
  Released: '#22c55e',
}

function VestingSchedule({ milestones, onUnlockMilestone, onReleaseMilestone, onReset }) {
  const chartData = ['Locked', 'Claimable', 'Released'].map((status) => ({
    name: status,
    value: milestones.filter((milestone) => milestone.status === status).reduce((sum, milestone) => sum + milestone.amountEth, 0),
  }))
  const releasedPercent = milestones.filter((milestone) => milestone.status === 'Released').reduce((sum, milestone) => sum + milestone.percent, 0)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Vesting / Milestone Schedule</h1>
            <p className="mt-2 text-sm text-indigo-200/70">Milestone payments reduce risk by releasing funds gradually instead of all at once.</p>
          </div>
          <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/5 px-4 py-2 text-sm font-semibold text-violet-100 hover:border-violet-300">
            <RotateCcw size={16} />
            Reset schedule
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-bold text-white">{milestone.title}</h2>
                  <p className="mt-1 text-sm text-indigo-200/70">{milestone.percent}% - {milestone.amountEth} ETH - Due {milestone.dueDate}</p>
                </div>
                <span className="rounded-full border border-violet-300/20 bg-violet-300/5 px-3 py-1 text-xs font-bold text-violet-100">{milestone.status}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-violet-400" style={{ width: `${milestone.percent}%` }} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => onUnlockMilestone(milestone.id)} disabled={milestone.status !== 'Locked'} className="min-h-10 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 disabled:opacity-50">
                  Mark claimable
                </button>
                <button type="button" onClick={() => onReleaseMilestone(milestone.id)} disabled={milestone.status !== 'Claimable'} className="min-h-10 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">
                  Release milestone
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
          <h2 className="font-bold text-white">Funds by milestone status</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={88}>
                  {chartData.map((entry) => <Cell key={entry.name} fill={statusColors[entry.name]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-indigo-200/70">{releasedPercent}% released in this simulated schedule.</p>
        </div>
      </div>
    </div>
  )
}

export default VestingSchedule
