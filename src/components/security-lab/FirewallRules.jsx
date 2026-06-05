import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import DecisionBadge from './DecisionBadge'
import SeverityBadge from './SeverityBadge'

function FirewallRules({ rules, onToggleRule, onResetRules }) {
  const [query, setQuery] = useState('')
  const [action, setAction] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')

  const filteredRules = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return rules
      .filter((rule) => action === 'all' || rule.action === action)
      .filter((rule) => stateFilter === 'all' || (stateFilter === 'enabled' ? rule.enabled : !rule.enabled))
      .filter((rule) => !normalized || `${rule.name} ${rule.target} ${rule.condition}`.toLowerCase().includes(normalized))
      .sort((a, b) => a.priority - b.priority)
  }, [action, query, rules, stateFilter])

  const activeRules = rules.filter((rule) => rule.enabled).length

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Firewall Rules</h1>
            <p className="mt-2 text-sm text-slate-400">
              Toggle simulated defensive rules and see how the request simulator reacts.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetRules}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
          >
            <RotateCcw size={16} />
            Reset rules
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search rules"
            className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-400 md:col-span-2"
          />
          <select value={action} onChange={(event) => setAction(event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white">
            <option value="all">All actions</option>
            <option value="allow">Allow</option>
            <option value="flag">Flag</option>
            <option value="block">Block</option>
          </select>
          <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white">
            <option value="all">All states</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          {activeRules} active rules out of {rules.length}.
        </p>
      </div>

      <div className="grid gap-4">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <DecisionBadge decision={rule.action === 'flag' ? 'flagged' : rule.action === 'block' ? 'blocked' : 'allowed'} />
                  <SeverityBadge severity={rule.severityImpact} />
                  <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300">
                    Priority {rule.priority}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{rule.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{rule.description}</p>
                <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                  <p><span className="text-slate-500">Target:</span> {rule.target}</p>
                  <p><span className="text-slate-500">Condition:</span> {rule.condition}</p>
                </div>
                {!rule.enabled && (
                  <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                    Disabling this rule may increase simulated risk.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onToggleRule(rule.id)}
                className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  rule.enabled
                    ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 ring-1 ring-slate-700 hover:text-white'
                }`}
              >
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FirewallRules
