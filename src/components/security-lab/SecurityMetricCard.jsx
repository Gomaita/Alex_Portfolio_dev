function SecurityMetricCard({ label, value, detail, tone = 'cyan' }) {
  const toneClass = {
    cyan: 'text-cyan-300',
    green: 'text-emerald-300',
    amber: 'text-amber-300',
    red: 'text-red-300',
    purple: 'text-purple-300',
  }[tone]

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${toneClass}`}>{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-400">{detail}</p>}
    </div>
  )
}

export default SecurityMetricCard
