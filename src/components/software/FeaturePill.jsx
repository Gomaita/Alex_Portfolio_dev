import { CheckCircle2 } from 'lucide-react'
import { getProjectAccent } from './softwareTheme'

function FeaturePill({ children, project }) {
  const accent = getProjectAccent(project)

  return (
    <span className="inline-flex items-start gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold leading-5 text-slate-700 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-200 dark:shadow-none">
      <CheckCircle2 className={`mt-0.5 shrink-0 ${accent.text}`} size={14} />
      <span>{children}</span>
    </span>
  )
}

export default FeaturePill
