import { useMemo, useState } from 'react'
import DecisionBadge from './DecisionBadge'
import SeverityBadge from './SeverityBadge'

function TrafficMonitor({ events }) {
  const [query, setQuery] = useState('')
  const [action, setAction] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [sortBy, setSortBy] = useState('riskScore')
  const [selectedId, setSelectedId] = useState(events[0]?.id)

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return events
      .filter((event) => action === 'all' || event.action === action)
      .filter((event) => severity === 'all' || event.severity === severity)
      .filter((event) =>
        !normalized ||
        `${event.sourceIp} ${event.target} ${event.matchedRule}`.toLowerCase().includes(normalized),
      )
      .sort((a, b) => (sortBy === 'time' ? b.time.localeCompare(a.time) : b.riskScore - a.riskScore))
  }, [action, events, query, severity, sortBy])

  const selectedEvent = filteredEvents.find((event) => event.id === selectedId) || filteredEvents[0]

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-300/12 bg-[#0b1220]/95 p-5 shadow-xl shadow-cyan-950/10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Traffic Monitor</h1>
            <p className="mt-2 text-sm text-[#8ea5c7]">
              Simulated firewall records using documentation IP ranges only.
            </p>
          </div>
          <p className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200">
            {filteredEvents.length} results
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search IP, path or rule"
            className="min-h-11 rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 text-sm text-white outline-none transition focus:border-cyan-300"
          />
          <select value={action} onChange={(event) => setAction(event.target.value)} className="min-h-11 rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 text-sm text-white">
            <option value="all">All actions</option>
            <option value="allowed">Allowed</option>
            <option value="flagged">Flagged</option>
            <option value="blocked">Blocked</option>
          </select>
          <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="min-h-11 rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 text-sm text-white">
            <option value="all">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-h-11 rounded-xl border border-cyan-300/15 bg-[#050816]/85 px-3 text-sm text-white">
            <option value="riskScore">Sort by risk</option>
            <option value="time">Sort by time</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-cyan-300/12 bg-[#0b1220]/95 shadow-xl shadow-cyan-950/10">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="border-b border-cyan-300/10 bg-[#050816] text-xs uppercase tracking-widest text-[#8ea5c7]">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Rule</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-300/10">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => setSelectedId(event.id)}
                    className={`cursor-pointer transition hover:bg-cyan-300/[0.055] ${selectedEvent?.id === event.id ? 'bg-cyan-400/10' : ''}`}
                  >
                    <td className="px-4 py-4 text-slate-300">{event.time}</td>
                    <td className="px-4 py-4 text-slate-300">{event.sourceIp}<span className="block text-xs text-slate-500">{event.country}</span></td>
                    <td className="px-4 py-4 text-slate-300">{event.method} {event.target}<span className="block text-xs text-slate-500">{event.protocol} :{event.port}</span></td>
                    <td className="px-4 py-4"><DecisionBadge decision={event.action} /></td>
                    <td className="px-4 py-4 text-slate-300">{event.matchedRule}</td>
                    <td className="px-4 py-4 font-bold text-white">{event.riskScore}</td>
                    <td className="px-4 py-4"><SeverityBadge severity={event.severity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-300/12 bg-[#0b1220]/95 p-5 shadow-xl shadow-cyan-950/10">
          {selectedEvent ? (
            <>
              <h2 className="text-xl font-bold text-white">Event detail</h2>
              <p className="mt-3 text-sm text-slate-400">Request summary</p>
              <p className="mt-1 font-semibold text-slate-100">{selectedEvent.method} {selectedEvent.target}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <DecisionBadge decision={selectedEvent.action} />
                <SeverityBadge severity={selectedEvent.severity} />
              </div>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                <p><span className="text-slate-500">Matched rule:</span> {selectedEvent.matchedRule}</p>
                <p><span className="text-slate-500">Reason:</span> {selectedEvent.reason}</p>
                <p><span className="text-slate-500">Recommendation:</span> {selectedEvent.recommendation}</p>
              </div>
              <div className="mt-5 rounded-2xl border border-cyan-300/12 bg-[#050816]/90 p-4">
                <p className="text-sm font-semibold text-white">Timeline</p>
                <ol className="mt-3 space-y-2 text-sm text-slate-400">
                  {['Request received', 'Input normalized', 'Rules evaluated', 'Decision applied'].map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-2 h-2 w-2 rounded-full bg-cyan-400" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">No event selected.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrafficMonitor
