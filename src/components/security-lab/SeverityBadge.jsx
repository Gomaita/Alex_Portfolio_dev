const severityStyles = {
  low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  high: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  critical: 'border-red-500/30 bg-red-500/10 text-red-200',
}

function SeverityBadge({ severity }) {
  const normalized = String(severity || 'low').toLowerCase()

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${severityStyles[normalized] || severityStyles.low}`}>
      {normalized}
    </span>
  )
}

export default SeverityBadge
