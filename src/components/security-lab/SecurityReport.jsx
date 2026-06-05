import { Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import RiskScoreCard from './RiskScoreCard'

function SecurityReport({ events, incidents, rules, postureScore }) {
  const [copied, setCopied] = useState(false)

  const topRules = useMemo(() => {
    const counts = events.reduce((acc, event) => {
      acc[event.matchedRule] = (acc[event.matchedRule] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
  }, [events])

  const blockedPaths = useMemo(() => {
    const counts = events
      .filter((event) => event.action === 'blocked')
      .reduce((acc, event) => {
        acc[event.target] = (acc[event.target] || 0) + 1
        return acc
      }, {})

    return Object.entries(counts)
  }, [events])

  const reportSummary = [
    `Security Operations Center Lite report`,
    `Posture score: ${postureScore}/100`,
    `Events reviewed: ${events.length}`,
    `Open incidents: ${incidents.filter((incident) => incident.status !== 'resolved' && incident.status !== 'archived').length}`,
    `Enabled firewall rules: ${rules.filter((rule) => rule.enabled).length}/${rules.length}`,
    `Main recommendation: keep admin endpoints protected, validate public inputs and keep metrics aggregate-only.`,
  ].join('\n')

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportSummary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Security Report</h1>
            <p className="mt-2 text-sm text-slate-400">
              A privacy-safe summary generated from simulated lab data.
            </p>
          </div>
          <button
            type="button"
            onClick={copyReport}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <Copy size={16} />
            {copied ? 'Copied' : 'Copy report summary'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <RiskScoreCard score={postureScore} />
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Main risks</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>Invalid admin route access attempts should remain blocked server-side.</li>
            <li>Suspicious public form payloads should be rejected before storage.</li>
            <li>Repeated contact attempts may need rate limiting if spam increases.</li>
            <li>Oversized request bodies should stay limited before validation.</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Top triggered rules</h2>
          <div className="mt-4 space-y-3">
            {topRules.map(([rule, count]) => (
              <div key={rule} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-sm text-slate-300">{rule}</span>
                <span className="font-bold text-cyan-300">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Most common blocked paths</h2>
          <div className="mt-4 space-y-3">
            {blockedPaths.map(([path, count]) => (
              <div key={path} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-sm text-slate-300">{path}</span>
                <span className="font-bold text-red-300">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Recommended improvements</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>Keep admin endpoints behind bearer token validation.</li>
            <li>Reject suspicious payloads before storing them.</li>
            <li>Add rate limiting for repeated contact attempts.</li>
            <li>Use Cloudflare Turnstile if spam increases.</li>
            <li>Keep public metrics aggregated only.</li>
            <li>Do not expose private logs or raw user data.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">What this lab demonstrates</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>Defensive security thinking.</li>
            <li>Request validation and normalization.</li>
            <li>Rule-based decisions.</li>
            <li>Incident review workflow.</li>
            <li>Risk scoring and dashboard design.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SecurityReport
