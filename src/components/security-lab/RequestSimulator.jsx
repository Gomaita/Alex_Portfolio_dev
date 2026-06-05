import { Play } from 'lucide-react'
import { useState } from 'react'
import { quickRequestScenarios } from '../../data/securityLabData'
import { evaluateRequest } from '../../utils/securityRules'
import DecisionBadge from './DecisionBadge'
import SeverityBadge from './SeverityBadge'

const defaultRequest = {
  method: 'GET',
  path: '/portfolio',
  sourceIp: '192.0.2.15',
  port: 443,
  protocol: 'HTTPS',
  payload: '',
  hasAdminToken: false,
}

function RequestSimulator({ rules }) {
  const [request, setRequest] = useState(defaultRequest)
  const [customPath, setCustomPath] = useState('')
  const [result, setResult] = useState(() => evaluateRequest(defaultRequest, rules))

  function updateField(field, value) {
    setRequest((current) => ({ ...current, [field]: value }))
  }

  function runSimulation(nextRequest = request) {
    const requestToEvaluate = {
      ...nextRequest,
      path: nextRequest.path === 'custom' ? customPath || '/' : nextRequest.path,
    }
    setRequest(nextRequest)
    setResult(evaluateRequest(requestToEvaluate, rules))
  }

  function applyScenario(scenario) {
    setCustomPath('')
    runSimulation(scenario.request)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h1 className="text-2xl font-bold text-white">Request Simulator</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Test simulated requests against the enabled firewall-style rules. Nothing is sent to a backend and no external URLs are scanned.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Request input</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Method
              <select value={request.method} onChange={(event) => updateField('method', event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-white">
                <option>GET</option>
                <option>POST</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Path
              <select value={request.path} onChange={(event) => updateField('path', event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-white">
                <option value="/api/contact">/api/contact</option>
                <option value="/api/admin/project-submissions">/api/admin/project-submissions</option>
                <option value="/api/metrics">/api/metrics</option>
                <option value="/portfolio">/portfolio</option>
                <option value="custom">custom path</option>
              </select>
            </label>
            {request.path === 'custom' && (
              <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
                Custom path
                <input value={customPath} onChange={(event) => setCustomPath(event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-white" />
              </label>
            )}
            <label className="grid gap-2 text-sm text-slate-300">
              Source IP
              <input value={request.sourceIp} onChange={(event) => updateField('sourceIp', event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-white" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Port
              <input type="number" value={request.port} onChange={(event) => updateField('port', event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-white" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Protocol
              <select value={request.protocol} onChange={(event) => updateField('protocol', event.target.value)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-white">
                <option>HTTPS</option>
                <option>HTTP</option>
              </select>
            </label>
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-300">
              <input type="checkbox" checked={request.hasAdminToken} onChange={(event) => updateField('hasAdminToken', event.target.checked)} />
              Has admin token
            </label>
            <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
              Payload
              <textarea value={request.payload} onChange={(event) => updateField('payload', event.target.value)} rows={5} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
              <span className="text-xs text-slate-500">Request size: {request.payload.length} chars</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => runSimulation()}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <Play size={16} />
            Run simulation
          </button>

          <div className="mt-5">
            <p className="text-sm font-semibold text-white">Quick scenarios</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickRequestScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => applyScenario(scenario)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200"
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-bold text-white">Simulation result</h2>
              <p className="mt-2 text-sm text-slate-400">Local-only evaluation using enabled rules.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <DecisionBadge decision={result.decision} />
              <SeverityBadge severity={result.severity} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Risk score</p>
            <p className="mt-3 text-5xl font-bold text-white">{result.riskScore}<span className="text-2xl text-slate-500">/100</span></p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-cyan-400" style={{ width: `${result.riskScore}%` }} />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-white">Matched rules</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.matchedRules.length ? result.matchedRules.map((rule) => (
                <span key={rule.id} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">
                  {rule.name}
                </span>
              )) : (
                <span className="text-sm text-slate-500">No rule matched.</span>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-semibold text-white">Recommendation</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{result.recommendation}</p>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-white">Timeline</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-400">
              {result.timeline.map((step) => (
                <li key={step} className="flex gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestSimulator
