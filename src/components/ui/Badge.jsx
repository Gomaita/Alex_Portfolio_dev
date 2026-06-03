const toneStyles = {
  cyan: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-200',
  blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-200',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200',
  violet: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-200',
  teal: 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-200',
  neutral: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
}

const variantTone = {
  default: 'neutral',
  info: 'blue',
  success: 'green',
  warning: 'violet',
  danger: 'neutral',
}

function Badge({ children, className = '', tone, variant = 'default' }) {
  const resolvedTone = tone || variantTone[variant] || 'neutral'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneStyles[resolvedTone] || toneStyles.neutral} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
