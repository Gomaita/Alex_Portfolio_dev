import { states } from '../../data/blockchainLabData'
import ContractStatusBadge from './ContractStatusBadge'

function ContractStateMachine({ status }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h1 className="text-2xl font-bold text-white">Contract State Machine</h1>
        <p className="mt-2 text-sm text-slate-400">Explicit states make escrow transitions easier to reason about and test.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex min-w-[860px] items-center gap-3">
          {['Created', 'Funded', 'Accepted', 'In Progress', 'Delivered', 'Released'].map((state, index, list) => (
            <div key={state} className="flex items-center gap-3">
              <div className={`rounded-2xl border p-4 text-center ${status === state ? 'border-violet-400 bg-violet-500/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                <p className="text-sm font-bold">{state}</p>
              </div>
              {index < list.length - 1 && <span className="text-slate-600">-&gt;</span>}
            </div>
          ))}
        </div>
        <div className="mt-6 flex min-w-[520px] items-center justify-center gap-3">
          <span className="text-slate-600">Accepted / Delivered</span>
          <span className="text-slate-600">-&gt;</span>
          <div className={`rounded-2xl border p-4 text-center ${status === 'Disputed' ? 'border-red-400 bg-red-500/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>Disputed</div>
          <span className="text-slate-600">-&gt;</span>
          <div className={`rounded-2xl border p-4 text-center ${status === 'Refunded' ? 'border-orange-400 bg-orange-500/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>Refunded</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {states.map((state) => (
          <div key={state.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-bold text-white">{state.id}</h2>
              {status === state.id && <ContractStatusBadge status={state.id} />}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{state.description}</p>
            <p className="mt-3 text-xs text-slate-500">Next: {state.next.length ? state.next.join(', ') : 'Final state'}</p>
            <p className="mt-1 text-xs text-slate-500">Triggered by: {state.triggers.length ? state.triggers.join(', ') : 'None'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContractStateMachine
