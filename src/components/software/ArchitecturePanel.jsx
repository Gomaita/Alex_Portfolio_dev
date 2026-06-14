import { ArrowRight, Boxes, Database, MonitorSmartphone, ServerCog } from 'lucide-react'
import { getProjectAccent } from './softwareTheme'

function ArchitecturePanel({ project }) {
  const accent = getProjectAccent(project)
  const steps = [
    ['Interface', 'Reusable React views, forms, filters and responsive states.', MonitorSmartphone],
    ['State and services', 'Local state, service helpers and normalized data shapes.', Boxes],
    ['Persistence layer', project.demoComponentKey?.includes('api') || project.technologies?.some((item) => /cloudflare|api|d1/i.test(item)) ? 'Cloudflare Functions, API routes or D1-backed responses.' : 'Demo-safe localStorage or static data persistence.', Database],
    ['Product workflow', 'Clear user actions, validation, feedback and future backend path.', ServerCog],
  ]

  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {steps.map(([title, text, Icon], index) => (
        <div key={title} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.045]">
          <Icon className={accent.text} size={22} />
          <h3 className="mt-3 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">{text}</p>
          {index < steps.length - 1 && (
            <ArrowRight className="absolute right-3 top-4 hidden text-slate-300 dark:text-slate-700 lg:block" size={16} />
          )}
        </div>
      ))}
    </div>
  )
}

export default ArchitecturePanel
