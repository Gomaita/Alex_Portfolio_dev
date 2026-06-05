import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import SecuritySidebar from './SecuritySidebar'

function SecurityShell({ activeTab, onTabChange, tabs, children }) {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#020617] bg-[radial-gradient(circle_at_top_left,#06b6d41f,transparent_34%),radial-gradient(circle_at_bottom_right,#22c55e14,transparent_28%)] text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/portfolio"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-200"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 uppercase tracking-[0.24em] text-cyan-200">
              Security Lab
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#22c55e]" />
              Live simulation
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
              No private logs
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr]">
        <SecuritySidebar activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
        <section className="min-w-0 rounded-3xl border border-slate-800/80 bg-slate-950/45 p-1 shadow-2xl shadow-cyan-950/10">
          {children}
        </section>
      </div>
    </main>
  )
}

export default SecurityShell
