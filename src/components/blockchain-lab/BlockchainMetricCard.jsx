function BlockchainMetricCard({ label, value, detail, tone = 'cyan' }) {
  const toneClass = {
    cyan: 'text-cyan-300',
    violet: 'text-violet-300',
    green: 'text-emerald-300',
    amber: 'text-amber-300',
    red: 'text-red-300',
  }[tone]

  return (
    <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/90 p-4 shadow-xl shadow-violet-950/10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-200/65">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${toneClass}`}>{value}</p>
      {detail && <p className="mt-2 text-sm text-indigo-200/65">{detail}</p>}
    </div>
  )
}

export default BlockchainMetricCard
