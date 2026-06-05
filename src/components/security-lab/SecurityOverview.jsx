import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { postureCategories } from '../../data/securityLabData'
import RiskScoreCard from './RiskScoreCard'
import SecurityMetricCard from './SecurityMetricCard'

const actionColors = {
  allowed: '#22c55e',
  blocked: '#ef4444',
  flagged: '#f59e0b',
}

function SecurityOverview({ events, incidents, postureScore }) {
  const actionData = ['allowed', 'blocked', 'flagged'].map((action) => ({
    name: action,
    value: events.filter((event) => event.action === action).length,
  }))

  const severityData = ['low', 'medium', 'high', 'critical'].map((severity) => ({
    severity,
    count: events.filter((event) => event.severity === severity).length,
  }))

  const riskTrend = events.map((event, index) => ({
    label: event.time,
    risk: Math.round(events.slice(0, index + 1).reduce((sum, item) => sum + item.riskScore, 0) / (index + 1)),
  }))

  const blocked = events.filter((event) => event.action === 'blocked').length
  const flagged = events.filter((event) => event.action === 'flagged').length
  const allowed = events.filter((event) => event.action === 'allowed').length
  const highRisk = events.filter((event) => ['high', 'critical'].includes(event.severity)).length
  const averageRisk = Math.round(events.reduce((sum, event) => sum + event.riskScore, 0) / events.length)
  const openIncidents = incidents.filter((incident) => incident.status !== 'resolved' && incident.status !== 'archived').length

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-cyan-500/20 bg-[radial-gradient(circle_at_top_right,#0e749033,transparent_35%),#0f172a] p-6 shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-200">
              Flagship security project
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-normal text-white sm:text-5xl">
              Security Operations Center Lite
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              A defensive security simulation for monitoring traffic, evaluating firewall rules and reviewing incidents.
            </p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
            <p className="font-semibold text-cyan-200">Simulated security data</p>
            <p className="mt-1">No real visitor traffic inspected</p>
          </div>
        </div>
        <p className="mt-5 rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
          This is a defensive security simulation. It does not inspect real visitor traffic or expose private logs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SecurityMetricCard label="Total events" value={events.length} detail="Simulated firewall records" />
        <SecurityMetricCard label="Blocked requests" value={blocked} detail="Denied by defensive rules" tone="red" />
        <SecurityMetricCard label="Allowed requests" value={allowed} detail="Normal public traffic" tone="green" />
        <SecurityMetricCard label="Flagged requests" value={flagged} detail="Needs review" tone="amber" />
        <SecurityMetricCard label="Open incidents" value={openIncidents} detail="Open or reviewing" tone="purple" />
        <SecurityMetricCard label="High risk events" value={highRisk} detail="High or critical severity" tone="red" />
        <SecurityMetricCard label="Average risk score" value={averageRisk} detail="Across simulated events" />
        <RiskScoreCard score={postureScore} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Allowed vs blocked vs flagged</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={actionData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {actionData.map((entry) => (
                    <Cell key={entry.name} fill={actionColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Events by severity</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="severity" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Security posture areas</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={postureCategories}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Risk score over time</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrend}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#38bdf8" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Top findings</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>Repeated invalid admin access attempts</li>
            <li>Suspicious contact form payloads</li>
            <li>Oversized POST request blocked</li>
            <li>Public routes operating normally</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SecurityOverview
