function BlockchainMetricCard({ label, value, detail, tone = 'cyan' }) {
  const toneClass = {
    cyan: 'text-cyan-300',
    violet: 'text-violet-300',
    green: 'text-emerald-300',
    amber: 'text-amber-300',
    red: 'text-red-300',
  }[tone]

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${toneClass}`}>{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-400">{detail}</p>}
    </div>
  )
}

export default BlockchainMetricCard
