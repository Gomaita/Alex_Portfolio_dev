import { Copy } from 'lucide-react'
import { useMemo, useState } from 'react'

function TransactionLog({ transactions }) {
  const [eventType, setEventType] = useState('all')
  const [role, setRole] = useState('all')
  const [selectedId, setSelectedId] = useState(transactions[0]?.id)

  const filtered = useMemo(() => transactions
    .filter((tx) => eventType === 'all' || tx.eventName === eventType)
    .filter((tx) => role === 'all' || tx.role === role), [eventType, role, transactions])

  const eventTypes = [...new Set(transactions.map((tx) => tx.eventName))]
  const roles = [...new Set(transactions.map((tx) => tx.role))]
  const selected = filtered.find((tx) => tx.id === selectedId) || filtered[0]

  async function copyHash(hash) {
    try {
      await navigator.clipboard.writeText(hash)
    } catch {
      // Clipboard can be blocked by the browser.
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <h1 className="text-2xl font-bold text-white">Transaction & Event Log</h1>
        <p className="mt-2 text-sm text-indigo-200/70">A mini explorer for simulated contract events. These are not real transactions.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <select value={eventType} onChange={(event) => setEventType(event.target.value)} className="min-h-11 rounded-xl border border-violet-300/15 bg-[#080b1f]/85 px-3 text-white">
            <option value="all">All events</option>
            {eventTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={role} onChange={(event) => setRole(event.target.value)} className="min-h-11 rounded-xl border border-violet-300/15 bg-[#080b1f]/85 px-3 text-white">
            <option value="all">All roles</option>
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-3">
          {filtered.map((tx) => (
            <button key={tx.id} type="button" onClick={() => setSelectedId(tx.id)} className={`w-full rounded-2xl border p-4 text-left shadow-xl transition ${selected?.id === tx.id ? 'border-violet-300 bg-violet-400/12 shadow-violet-950/20' : 'border-violet-300/12 bg-[#11112a]/95 shadow-violet-950/10 hover:border-violet-300/35'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-white">{tx.eventName}</p>
                  <p className="mt-1 text-sm text-indigo-200/70">{tx.description}</p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200">{tx.status}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
          {selected ? (
            <>
              <h2 className="text-xl font-bold text-white">{selected.eventName}</h2>
              <p className="mt-2 text-sm text-indigo-200/70">Simulated transaction</p>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p><span className="text-slate-500">Role:</span> {selected.role}</p>
                <p><span className="text-slate-500">From:</span> {selected.from}</p>
                <p><span className="text-slate-500">To:</span> {selected.to}</p>
                <p><span className="text-slate-500">Amount:</span> {selected.amount}</p>
                <p><span className="text-slate-500">Time:</span> {selected.timestamp}</p>
              </div>
              <button type="button" onClick={() => copyHash(selected.fakeTxHash)} className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/5 px-3 py-2 text-sm font-semibold text-violet-100 hover:border-violet-300">
                <Copy size={15} />
                <span className="truncate">{selected.fakeTxHash}</span>
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-400">No transaction selected.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionLog
