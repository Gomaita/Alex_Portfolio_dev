function SecuritySidebar({ activeTab, onTabChange, tabs }) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-xl shadow-slate-950/30">
        <div className="mb-3 px-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Modules</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition lg:w-full ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-400/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default SecuritySidebar
