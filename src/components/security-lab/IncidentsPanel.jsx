import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import SeverityBadge from './SeverityBadge'

function IncidentsPanel({ incidents, onUpdateIncident, onResetIncidents }) {
  const [status, setStatus] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [selectedId, setSelectedId] = useState(incidents[0]?.id)

  const filteredIncidents = useMemo(() => (
    incidents
      .filter((incident) => status === 'all' || incident.status === status)
      .filter((incident) => severity === 'all' || incident.severity === severity)
  ), [incidents, severity, status])

  const selectedIncident = incidents.find((incident) => incident.id === selectedId) || filteredIncidents[0]

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-300/12 bg-[#0b1220]/95 p-5 shadow-xl shadow-cyan-950/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Incidents</h1>
            <p className="mt-2 text-sm text-[#8ea5c7]">Review simulated incidents derived from firewall events.</p>
          </div>
          <button
            type="button"
            onClick={onResetIncidents}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
          >
            <RotateCcw size={16} />
            Reset incidents
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 text-sm text-white">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
          <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="min-h-11 rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 text-sm text-white">
            <option value="all">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {filteredIncidents.map((incident) => (
            <button
              key={incident.id}
              type="button"
              onClick={() => setSelectedId(incident.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selectedIncident?.id === incident.id
                  ? 'border-cyan-300/55 bg-cyan-300/10 shadow-lg shadow-cyan-950/20'
                  : 'border-cyan-300/12 bg-[#0b1220]/95 hover:border-cyan-300/35'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={incident.severity} />
                <span className="rounded-full border border-cyan-300/15 bg-[#050816]/70 px-2.5 py-1 text-xs font-semibold capitalize text-[#8ea5c7]">
                  {incident.status}
                </span>
              </div>
              <h2 className="mt-3 font-bold text-white">{incident.title}</h2>
              <p className="mt-2 text-sm text-[#8ea5c7]">{incident.recommendation}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-cyan-300/12 bg-[#0b1220]/95 p-5 shadow-xl shadow-cyan-950/10">
          {selectedIncident ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedIncident.title}</h2>
                  <p className="mt-2 text-sm text-[#8ea5c7]">{selectedIncident.source} - {selectedIncident.createdAt}</p>
                </div>
                <SeverityBadge severity={selectedIncident.severity} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-300">
                  Status
                  <select
                    value={selectedIncident.status}
                    onChange={(event) => onUpdateIncident(selectedIncident.id, { status: event.target.value })}
                    className="min-h-11 rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 text-white"
                  >
                    <option value="open">Open</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <div className="rounded-2xl border border-cyan-300/12 bg-[#050816]/85 p-3 text-sm text-[#8ea5c7]">
                  <p className="text-slate-500">Owner</p>
                  <p className="mt-1 font-semibold text-white">{selectedIncident.owner}</p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                <p><span className="text-slate-500">Recommendation:</span> {selectedIncident.recommendation}</p>
                <p><span className="text-slate-500">Related events:</span> {selectedIncident.relatedEvents.join(', ')}</p>
                <p><span className="text-slate-500">Triggered rules:</span> {selectedIncident.triggeredRules.join(', ')}</p>
              </div>

              <label className="mt-5 grid gap-2 text-sm text-slate-300">
                Internal note
                <textarea
                  value={selectedIncident.notes}
                  onChange={(event) => onUpdateIncident(selectedIncident.id, { notes: event.target.value })}
                  rows={5}
                  className="rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 py-3 text-white"
                />
              </label>

              <div className="mt-5 rounded-2xl border border-cyan-300/12 bg-[#050816]/85 p-4">
                <p className="text-sm font-semibold text-white">Timeline</p>
                <ol className="mt-3 space-y-2 text-sm text-slate-400">
                  {['Incident created', 'Related events grouped', 'Rules reviewed', 'Recommendation drafted'].map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-2 h-2 w-2 rounded-full bg-cyan-400" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">No incident selected.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default IncidentsPanel
