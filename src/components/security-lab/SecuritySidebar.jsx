function SecuritySidebar({ activeTab, onTabChange, tabs }) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-[1.6rem] border border-cyan-300/12 bg-[#0b1220]/92 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <div className="mb-3 px-2">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200/70">SOC modules</p>
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
                    ? 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/40 shadow-lg shadow-cyan-950/20'
                    : 'text-[#8ea5c7] hover:bg-white/[0.06] hover:text-white'
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
