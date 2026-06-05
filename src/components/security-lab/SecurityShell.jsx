import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import SecuritySidebar from './SecuritySidebar'

function SecurityShell({ activeTab, onTabChange, tabs, children }) {
  return (
    <main className="min-h-[calc(100svh-4rem)] overflow-hidden bg-[#050816] bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px),radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(34,197,94,0.12),transparent_24%),linear-gradient(135deg,#050816,#07111f_46%,#030712)] bg-[length:48px_48px,48px_48px,auto,auto,auto] text-[#e5f0ff]">
      <div className="border-b border-cyan-300/10 bg-[#07111f]/88 px-5 py-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
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

      <div className="mx-auto max-w-7xl px-5 pt-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#0b1220]/88 p-5 shadow-2xl shadow-cyan-950/25 sm:p-6">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_42%)]" />
          <div className="relative grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200">
                Defensive security simulation
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">
                Security Operations Center Lite
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#8ea5c7] sm:text-base">
                Simulated SOC workspace for request monitoring, firewall-style rules, incident review and risk posture.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                ['Risk posture', '78/100', 'text-cyan-200'],
                ['System status', 'Stable', 'text-emerald-300'],
                ['Last check', 'Simulated', 'text-amber-200'],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#8ea5c7]">{label}</p>
                  <p className={`mt-2 text-lg font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr]">
        <SecuritySidebar activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
        <section className="min-w-0 rounded-[2rem] border border-cyan-300/10 bg-[#07111f]/62 p-2 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
          {children}
        </section>
      </div>
    </main>
  )
}

export default SecurityShell
