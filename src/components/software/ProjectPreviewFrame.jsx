import { Bot, Database, Dumbbell, KeyRound, LineChart, ShieldCheck, Table2, UsersRound } from 'lucide-react'
import { getProjectAccent } from './softwareTheme'

function MiniMetric({ label, value, project }) {
  const accent = getProjectAccent(project)

  return (
    <div className="rounded-xl border border-white/10 bg-white/75 p-3 shadow-sm dark:bg-slate-950/50">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-black ${accent.text}`}>{value}</p>
    </div>
  )
}

function WindowChrome({ children, project, label = 'Product preview' }) {
  const accent = getProjectAccent(project)

  return (
    <div className={`relative overflow-hidden rounded-[1.4rem] border bg-white shadow-2xl shadow-slate-900/10 dark:bg-slate-950/92 ${accent.border}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.glow}`} />
      <div className="relative border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="truncate text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</span>
        </div>
      </div>
      <div className="relative p-4 sm:p-5">{children}</div>
    </div>
  )
}

function NutriCorePreview({ project }) {
  return (
    <WindowChrome project={project} label="NutriCore app">
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniMetric project={project} label="Weight" value="78.4 kg" />
        <MiniMetric project={project} label="Change" value="-2.1 kg" />
        <MiniMetric project={project} label="Next" value="Pull" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/[0.06]">
          <Dumbbell className="text-emerald-500" size={26} />
          <h3 className="mt-3 text-sm font-black text-slate-950 dark:text-white">Training</h3>
          <div className="mt-3 space-y-2">
            {['Bench press', 'Rows', 'Core work'].map((item) => (
              <div key={item} className="h-2 rounded-full bg-emerald-400/40" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-950 p-4 text-white">
          <div className="flex items-end gap-2">
            {[36, 54, 42, 68, 58, 74].map((height, index) => (
              <span key={index} className="w-full rounded-t bg-emerald-400" style={{ height }} />
            ))}
          </div>
        </div>
      </div>
    </WindowChrome>
  )
}

function SQLPreview({ project }) {
  return (
    <WindowChrome project={project} label="SQL playground">
      <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-sky-100">
        <p><span className="text-cyan-300">SELECT</span> name, role, status</p>
        <p><span className="text-cyan-300">FROM</span> users</p>
        <p><span className="text-cyan-300">WHERE</span> active = true;</p>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
        {['Alex / Admin / Active', 'Marta / Editor / Active', 'Leo / Viewer / Pending'].map((row) => (
          <div key={row} className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 last:border-b-0 dark:border-white/10 dark:text-slate-300">
            {row}
          </div>
        ))}
      </div>
    </WindowChrome>
  )
}

function SecurityPreview({ project }) {
  return (
    <WindowChrome project={project} label="Roles and permissions">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Admin', 'Full access', ShieldCheck],
          ['Moderator', 'Review users', UsersRound],
          ['Viewer', 'Read only', KeyRound],
          ['Audit', 'Hashed records', Database],
        ].map(([title, text, Icon]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <Icon className="text-violet-500" size={22} />
            <h3 className="mt-3 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </WindowChrome>
  )
}

function CrudPreview({ project }) {
  return (
    <WindowChrome project={project} label="Project board">
      <div className="grid gap-3 sm:grid-cols-3">
        {['Review', 'In Progress', 'Approved'].map((column, index) => (
          <div key={column} className="rounded-2xl bg-slate-100 p-3 dark:bg-white/[0.06]">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{column}</p>
            <div className="mt-3 space-y-2">
              <div className={`h-14 rounded-xl ${index === 0 ? 'bg-orange-400/35' : index === 1 ? 'bg-blue-400/35' : 'bg-emerald-400/35'}`} />
              <div className="h-10 rounded-xl bg-white/80 dark:bg-slate-950/40" />
            </div>
          </div>
        ))}
      </div>
    </WindowChrome>
  )
}

function DefaultPreview({ project }) {
  return (
    <WindowChrome project={project} label={project.type || 'Application'}>
      <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/[0.06]">
          <LineChart className="text-blue-500" size={24} />
          <div className="mt-5 space-y-2">
            <div className="h-2 rounded-full bg-blue-400/45" />
            <div className="h-2 w-4/5 rounded-full bg-cyan-400/35" />
            <div className="h-2 w-3/5 rounded-full bg-indigo-400/35" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.05]">
          <Table2 className="text-cyan-500" size={24} />
          <div className="mt-4 grid gap-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-8 rounded-lg bg-slate-100 dark:bg-slate-900/80" />
            ))}
          </div>
        </div>
      </div>
    </WindowChrome>
  )
}

function ChatPreview({ project }) {
  return (
    <WindowChrome project={project} label="Nova AI Chat">
      <div className="space-y-3">
        <div className="mr-10 rounded-2xl bg-slate-100 p-3 text-xs font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
          Explain this concept in simple terms.
        </div>
        <div className="ml-10 rounded-2xl bg-violet-500 p-3 text-xs font-semibold text-white">
          Here is a clear explanation with an example and next steps.
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.05]">
        <Bot className="text-violet-500" size={18} />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Balanced mode · demo fallback ready</span>
      </div>
    </WindowChrome>
  )
}

function ProjectPreviewFrame({ project }) {
  const key = project.demoComponentKey

  if (key === 'nutricore') return <NutriCorePreview project={project} />
  if (key === 'sql') return <SQLPreview project={project} />
  if (key === 'secure-users' || key === 'auth-flow') return <SecurityPreview project={project} />
  if (key === 'crud') return <CrudPreview project={project} />
  if (key === 'nova-ai-chat') return <ChatPreview project={project} />

  return <DefaultPreview project={project} />
}

export default ProjectPreviewFrame
