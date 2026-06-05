function RiskScoreCard({ score }) {
  const color = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-cyan-400' : score >= 40 ? 'bg-amber-400' : 'bg-red-400'
  const label = score >= 80 ? 'Lower risk' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High risk'

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-slate-900 p-5 shadow-xl shadow-violet-950/20">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Contract risk score</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-5xl font-bold text-white">{score}<span className="text-2xl text-slate-500">/100</span></p>
        <p className="text-sm font-bold text-violet-200">{label}</p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default RiskScoreCard
