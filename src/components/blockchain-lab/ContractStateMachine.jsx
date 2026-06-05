import { states } from '../../data/blockchainLabData'
import ContractStatusBadge from './ContractStatusBadge'

function ContractStateMachine({ status }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <h1 className="text-2xl font-bold text-white">Contract State Machine</h1>
        <p className="mt-2 text-sm text-indigo-200/70">Explicit states make escrow transitions easier to reason about and test.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <div className="flex min-w-[860px] items-center gap-3">
          {['Created', 'Funded', 'Accepted', 'In Progress', 'Delivered', 'Released'].map((state, index, list) => (
            <div key={state} className="flex items-center gap-3">
              <div className={`rounded-2xl border p-4 text-center shadow-lg ${status === state ? 'border-violet-300 bg-violet-400/20 text-white shadow-violet-950/30' : 'border-violet-300/10 bg-[#080b1f]/85 text-indigo-200/60'}`}>
                <p className="text-sm font-bold">{state}</p>
              </div>
              {index < list.length - 1 && <span className="text-violet-300/45">-&gt;</span>}
            </div>
          ))}
        </div>
        <div className="mt-6 flex min-w-[520px] items-center justify-center gap-3">
          <span className="text-indigo-200/45">Accepted / Delivered</span>
          <span className="text-violet-300/45">-&gt;</span>
          <div className={`rounded-2xl border p-4 text-center shadow-lg ${status === 'Disputed' ? 'border-rose-400 bg-rose-500/20 text-white' : 'border-violet-300/10 bg-[#080b1f]/85 text-indigo-200/60'}`}>Disputed</div>
          <span className="text-violet-300/45">-&gt;</span>
          <div className={`rounded-2xl border p-4 text-center shadow-lg ${status === 'Refunded' ? 'border-amber-400 bg-amber-500/20 text-white' : 'border-violet-300/10 bg-[#080b1f]/85 text-indigo-200/60'}`}>Refunded</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {states.map((state) => (
          <div key={state.id} className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-bold text-white">{state.id}</h2>
              {status === state.id && <ContractStatusBadge status={state.id} />}
            </div>
            <p className="mt-3 text-sm leading-6 text-indigo-200/70">{state.description}</p>
            <p className="mt-3 text-xs text-indigo-200/45">Next: {state.next.length ? state.next.join(', ') : 'Final state'}</p>
            <p className="mt-1 text-xs text-indigo-200/45">Triggered by: {state.triggers.length ? state.triggers.join(', ') : 'None'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContractStateMachine
