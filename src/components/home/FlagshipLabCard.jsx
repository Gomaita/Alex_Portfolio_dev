import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const accentStyles = {
  cyan: {
    border: 'border-cyan-200 dark:border-cyan-900/70',
    badge: 'bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-200 dark:ring-cyan-800',
    glow: 'from-cyan-400/20 to-emerald-400/10',
    icon: 'text-cyan-600 dark:text-cyan-300',
    button: 'text-cyan-700 hover:text-cyan-800 dark:text-cyan-200 dark:hover:text-cyan-100',
  },
  violet: {
    border: 'border-violet-200 dark:border-violet-900/70',
    badge: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-200 dark:ring-violet-800',
    glow: 'from-violet-400/20 to-cyan-400/10',
    icon: 'text-violet-600 dark:text-violet-300',
    button: 'text-violet-700 hover:text-violet-800 dark:text-violet-200 dark:hover:text-violet-100',
  },
}

function FlagshipLabCard({
  title,
  subtitle,
  description,
  href,
  label,
  accent = 'cyan',
  bullets = [],
  metrics = [],
}) {
  const styles = accentStyles[accent] || accentStyles.cyan

  return (
    <article
      className={`relative flex h-full min-h-[420px] overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:shadow-none sm:p-7 ${styles.border}`}
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${styles.glow}`} />
      <div className="relative flex min-h-full w-full flex-col justify-center">
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ring-1 ${styles.badge}`}>
            {label}
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <CheckCircle2 className={styles.icon} size={17} />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        {metrics.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <span
                key={metric}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                {metric}
              </span>
            ))}
          </div>
        )}

        <Link
          to={href}
          className={`mt-7 inline-flex w-fit items-center gap-2 text-sm font-bold transition ${styles.button}`}
        >
          Open {title}
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export default FlagshipLabCard
