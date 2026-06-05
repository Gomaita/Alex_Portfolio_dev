const decisionStyles = {
  allowed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  flagged: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  blocked: 'border-red-500/30 bg-red-500/10 text-red-200',
}

function DecisionBadge({ decision }) {
  const normalized = String(decision || 'allowed').toLowerCase()

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${decisionStyles[normalized] || decisionStyles.allowed}`}>
      {normalized}
    </span>
  )
}

export default DecisionBadge
