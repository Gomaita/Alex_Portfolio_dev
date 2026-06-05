import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlockchainSidebar from './BlockchainSidebar'

function BlockchainShell({ activeTab, onTabChange, tabs, children }) {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/portfolio" className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400 hover:text-violet-200">
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">Blockchain Lab</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[270px_1fr]">
        <BlockchainSidebar activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  )
}

export default BlockchainShell
