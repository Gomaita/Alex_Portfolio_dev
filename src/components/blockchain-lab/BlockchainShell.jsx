import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlockchainSidebar from './BlockchainSidebar'

function BlockchainShell({ activeTab, onTabChange, tabs, children }) {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#020617] bg-[radial-gradient(circle_at_top_left,#8b5cf621,transparent_34%),radial-gradient(circle_at_bottom_right,#06b6d414,transparent_30%)] text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/portfolio" className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400 hover:text-violet-200">
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 uppercase tracking-[0.24em] text-violet-200">
              Blockchain Lab
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#06b6d4]" />
              Simulated chain
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
              No wallet or funds
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[270px_1fr]">
        <BlockchainSidebar activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
        <section className="min-w-0 rounded-3xl border border-slate-800/80 bg-slate-950/45 p-1 shadow-2xl shadow-violet-950/10">
          {children}
        </section>
      </div>
    </main>
  )
}

export default BlockchainShell
