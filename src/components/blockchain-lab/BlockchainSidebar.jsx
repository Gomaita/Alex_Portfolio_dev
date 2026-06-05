function BlockchainSidebar({ activeTab, onTabChange, tabs }) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-[1.6rem] border border-violet-300/12 bg-[#11112a]/92 p-3 shadow-2xl shadow-violet-950/20 backdrop-blur">
        <p className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.26em] text-violet-200/75">Contract modules</p>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition lg:w-full ${
                  active ? 'bg-violet-300/15 text-violet-100 ring-1 ring-violet-300/40 shadow-lg shadow-violet-950/20' : 'text-indigo-200/75 hover:bg-white/[0.06] hover:text-white'
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

export default BlockchainSidebar
