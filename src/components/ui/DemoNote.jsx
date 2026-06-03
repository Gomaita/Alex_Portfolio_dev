import Badge from './Badge'

const variants = {
  default:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300',
  info:
    'border-blue-200 bg-blue-50 text-blue-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100',
}

function DemoNote({ children, className = '', title = 'Educational demo', variant = 'default' }) {
  return (
    <div className={`rounded-xl border p-4 text-sm leading-6 ${variants[variant]} ${className}`}>
      <div className="mb-2">
        <Badge variant={variant === 'warning' ? 'warning' : 'default'}>{title}</Badge>
      </div>
      <p>{children}</p>
    </div>
  )
}

export default DemoNote
