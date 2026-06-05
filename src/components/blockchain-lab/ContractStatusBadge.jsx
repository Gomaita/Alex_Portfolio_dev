const statusStyles = {
  Created: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
  Funded: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
  Accepted: 'border-violet-500/40 bg-violet-500/10 text-violet-200',
  'In Progress': 'border-blue-500/40 bg-blue-500/10 text-blue-200',
  Delivered: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  Released: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  Disputed: 'border-red-500/40 bg-red-500/10 text-red-200',
  Refunded: 'border-orange-500/40 bg-orange-500/10 text-orange-200',
  Cancelled: 'border-slate-600 bg-slate-800 text-slate-300',
}

function ContractStatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status] || statusStyles.Created}`}>
      {status}
    </span>
  )
}

export default ContractStatusBadge
