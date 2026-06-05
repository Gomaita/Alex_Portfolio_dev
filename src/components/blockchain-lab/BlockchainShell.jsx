import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlockchainSidebar from './BlockchainSidebar'

function BlockchainShell({ activeTab, onTabChange, tabs, children }) {
  return (
    <main className="min-h-[calc(100svh-4rem)] overflow-hidden bg-[#07051a] bg-[linear-gradient(rgba(139,92,246,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.035)_1px,transparent_1px),radial-gradient(circle_at_12%_10%,rgba(139,92,246,0.24),transparent_32%),radial-gradient(circle_at_88%_16%,rgba(6,182,212,0.13),transparent_26%),linear-gradient(135deg,#07051a,#080b1f_48%,#030712)] bg-[length:54px_54px,54px_54px,auto,auto,auto] text-slate-100">
      <div className="border-b border-violet-300/10 bg-[#080b1f]/88 px-5 py-4 shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
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

      <div className="mx-auto max-w-7xl px-5 pt-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-violet-300/15 bg-[#11112a]/86 p-5 shadow-2xl shadow-violet-950/25 sm:p-6">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.22),transparent_42%)]" />
          <div className="relative grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-violet-200">
                Educational simulation
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">
                Smart Escrow & Contract Security Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-indigo-200/75 sm:text-base">
                Contract-style workspace for escrow state, role permissions, simulated event logs and risk notes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                ['Contract status', 'Simulated', 'text-violet-200'],
                ['Value locked', '7.5 ETH', 'text-cyan-200'],
                ['Risk score', '82/100', 'text-emerald-300'],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-indigo-200/65">{label}</p>
                  <p className={`mt-2 text-lg font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[270px_1fr]">
        <BlockchainSidebar activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
        <section className="min-w-0 rounded-[2rem] border border-violet-300/10 bg-[#080b1f]/64 p-2 shadow-2xl shadow-violet-950/20 backdrop-blur-sm">
          {children}
        </section>
      </div>
    </main>
  )
}

export default BlockchainShell
