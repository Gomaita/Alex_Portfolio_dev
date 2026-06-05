import { useState } from 'react'
import { soliditySnippets } from '../../data/blockchainLabData'

function SolidityPreview() {
  const [activeId, setActiveId] = useState(soliditySnippets[0].id)
  const active = soliditySnippets.find((snippet) => snippet.id === activeId) || soliditySnippets[0]

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h1 className="text-2xl font-bold text-white">Contract Code</h1>
        <p className="mt-2 text-sm text-slate-400">Simplified Solidity for learning purposes. This is not production contract code.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-3 lg:flex-col lg:overflow-visible">
          {soliditySnippets.map((snippet) => (
            <button key={snippet.id} type="button" onClick={() => setActiveId(snippet.id)} className={`min-h-11 shrink-0 rounded-lg px-3 py-2 text-left text-sm font-semibold ${activeId === snippet.id ? 'bg-violet-500/20 text-violet-100' : 'text-slate-300 hover:bg-slate-800'}`}>
              {snippet.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-bold text-white">{active.label}</h2>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-cyan-100"><code>{active.code}</code></pre>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="font-semibold text-white">Explanation</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{active.explanation}</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="font-semibold text-amber-200">Security note</p>
              <p className="mt-2 text-sm leading-6 text-amber-100">{active.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolidityPreview
