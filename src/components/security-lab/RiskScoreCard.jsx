function getPosture(score) {
  if (score >= 85) return { label: 'Low risk', color: 'text-emerald-300', bar: 'bg-emerald-400' }
  if (score >= 70) return { label: 'Moderate', color: 'text-cyan-300', bar: 'bg-cyan-400' }
  if (score >= 50) return { label: 'Elevated', color: 'text-amber-300', bar: 'bg-amber-400' }
  return { label: 'High', color: 'text-red-300', bar: 'bg-red-400' }
}

function RiskScoreCard({ score }) {
  const posture = getPosture(score)

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5 shadow-xl shadow-cyan-950/20">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Security posture score</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-5xl font-bold text-white">{score}<span className="text-2xl text-slate-500">/100</span></p>
        <p className={`text-sm font-bold ${posture.color}`}>{posture.label}</p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${posture.bar}`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">
        Score is calculated from simulated events, enabled defensive rules and incident status.
      </p>
    </div>
  )
}

export default RiskScoreCard
