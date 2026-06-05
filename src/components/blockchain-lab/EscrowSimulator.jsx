import { RotateCcw } from 'lucide-react'
import { escrowActionRules, getAvailableActions } from '../../utils/escrowStateMachine'
import ContractStatusBadge from './ContractStatusBadge'

function EscrowSimulator({ agreement, role, onRoleChange, onAction, onReset, securityNote }) {
  const availableActions = getAvailableActions(role, agreement.currentStatus)
  const allActions = Object.entries(escrowActionRules).map(([id, action]) => ({ id, ...action }))

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Escrow Simulator</h1>
            <p className="mt-2 text-sm text-slate-400">
              Simulated escrow between Client, Freelancer and Arbiter. No wallet or funds are used.
            </p>
          </div>
          <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400 hover:text-violet-200">
            <RotateCcw size={16} />
            Reset simulation
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Role switcher</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {['Client', 'Freelancer', 'Arbiter'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onRoleChange(item)}
                  className={`min-h-11 rounded-lg px-4 py-2 text-sm font-bold transition ${role === item ? 'bg-violet-500 text-white' : 'border border-slate-700 text-slate-300 hover:border-violet-400'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Contract status</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <ContractStatusBadge status={agreement.currentStatus} />
              <p className="text-sm text-slate-400">{agreement.deadline}</p>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <p><span className="text-slate-500">Title:</span> {agreement.agreementTitle}</p>
              <p><span className="text-slate-500">Contract:</span> {agreement.contractAddress}</p>
              <p><span className="text-slate-500">Locked:</span> {agreement.balanceLocked} ETH</p>
              <p><span className="text-slate-500">Released:</span> {agreement.balanceReleased} ETH</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Available actions</h2>
          <p className="mt-2 text-sm text-slate-400">Buttons are enabled only when the selected role and state can execute them.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {allActions.map((action) => {
              const enabled = availableActions.some((item) => item.id === action.id)
              return (
                <button
                  key={action.id}
                  type="button"
                  disabled={!enabled}
                  onClick={() => onAction(action.id)}
                  className={`rounded-xl border p-4 text-left transition ${enabled ? 'border-violet-500/50 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20' : 'border-slate-800 bg-slate-950 text-slate-500'}`}
                >
                  <span className="font-semibold">{action.label}</span>
                  <span className="mt-2 block text-xs leading-5">{enabled ? `Allowed for ${role}` : `Requires ${action.roles.join(' or ')} from ${action.from.join(', ')}`}</span>
                </button>
              )
            })}
          </div>
          {securityNote && (
            <p className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm leading-6 text-cyan-100">
              {securityNote}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EscrowSimulator
