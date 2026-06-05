function SecurityMetricCard({ label, value, detail, tone = 'cyan' }) {
  const toneClass = {
    cyan: 'text-cyan-300',
    green: 'text-emerald-300',
    amber: 'text-amber-300',
    red: 'text-red-300',
    purple: 'text-purple-300',
  }[tone]

  return (
    <div className="rounded-2xl border border-cyan-300/12 bg-[#0b1220]/90 p-4 shadow-xl shadow-cyan-950/10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8ea5c7]">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${toneClass}`}>{value}</p>
      {detail && <p className="mt-2 text-sm text-[#8ea5c7]">{detail}</p>}
    </div>
  )
}

export default SecurityMetricCard
